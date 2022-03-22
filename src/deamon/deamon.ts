import {Server} from '../nxth7p';
import controllers from './controllers';

const deamon = new Server();

Object.keys(controllers).forEach((key) => {
  const controller = controllers[key];
  deamon.add_controller(controller);
});

export default deamon;
