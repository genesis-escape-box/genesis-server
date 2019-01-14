import State from '../state';
import { StateManager } from '../services/state-manager';
import arduinoService from '../../services/arduino-service';
import { ArduinoEvents } from '../constans';
import UnityRestService from '../../services/unity-rest-service';
import { Constans } from '../constans';

class GenesisGreeting extends State {
  readonly sceneName = 'GenesisGreeting';

  manager: StateManager;

  execute = (manager: StateManager): void => {
    this.manager = manager;
    UnityRestService.sendTheardUnityMessage('load-scene', Constans.LOAD_SCENE + ':ConsoleBlincking');
    super.loadUnityScene(true);
    arduinoService.sendMessage(ArduinoEvents.BLUE);
  };
}

export default new GenesisGreeting();
