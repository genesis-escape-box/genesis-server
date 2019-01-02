import { StateManager } from './services/state-manager';
import UnityRestService, { UnityRestListenerType } from '../services/unity-rest-service';
import ArduinoService, { ArduinoListenerType } from '../services/arduino-service';

import { Constans } from './constans';
import scenesService from './services/scenes-service';

export default abstract class State {
  manager: StateManager;

  abstract readonly sceneName;

  constructor() {}

  loadUnityScene(sendToSecondaryUnity: boolean, alternaticeSceneName?: string) {
    const sceneToLoad = alternaticeSceneName || this.sceneName;
    const message = `${Constans.LOAD_SCENE}:${sceneToLoad}`;
    UnityRestService.sendPrimaryUnityMessage('load-scene', message);

    if (sendToSecondaryUnity) {
      UnityRestService.sendSecondryUnityMessage(Constans.LOAD_SCENE, message);
    }
  }

  getSceneName() {
    return this.sceneName;
  }

  setSerialPortListener(serialPortListener: ArduinoListenerType) {
    ArduinoService.addListener(this.sceneName, serialPortListener);
  }

  removeRestListener() {
    UnityRestService.removeListener(this.sceneName);
  }

  removeSerialListener() {
    ArduinoService.removeListener(this.sceneName);
  }

  moveToNextScene() {
    console.log('SceneEnd: ' + this.sceneName);
    const nextScene = scenesService.getNextSceneByName(this.sceneName);
    console.log('nextScene: ' + nextScene.sceneName);
    this.manager.setState(nextScene);
    this.manager.execute();
  }

  handleRestRequest(request, response) {
    if (request.body && request.body.SceneEnd === '') {
      this.moveToNextScene();
    }
    response.status(200).json({ msg: 'OK' });
  }

  abstract execute: (manager: StateManager) => void;

  destroy(): void {
    this.removeRestListener();
    this.removeSerialListener();
  }
}
