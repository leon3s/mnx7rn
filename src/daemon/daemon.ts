import {Server} from '../HttpServer';
import controllers from './controllers';
import {store} from './services';

class Daemon {
  daemon: Server;

  constructor() {
    this.daemon = new Server();
  }

  private _add_controllers = () => {
    Object.keys(controllers).forEach((key) => {
      const controller = controllers[key];
      this.daemon.add_controller(controller);
    });
  }

  boot = async () => {
    await store.mount();
    this._add_controllers();
  }

  listen = (host: string, port?: number) => {
    this.daemon.listen(host, port);
  }

  close = async () => {
    await this.daemon.close();
  }
}

const daemon = new Daemon();

export default daemon;
