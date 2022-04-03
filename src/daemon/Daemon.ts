import path from 'path';
import { stdout } from 'process';

import { Server } from '../lib/HttpServer';

import { store } from './Store';
import controllers from './controllers';
import { watch_docker } from './watchers';

import type { Store } from './Store';

export type DaemonOpts = {
  store_path?: string;
}

class Daemon {
  server: Server;
  store: Store;
  store_path: string;

  constructor(opts: DaemonOpts) {
    this.store_path = opts.store_path || path.join(__dirname, '../../store');
    this.server = new Server();
    this.store = store;
    this._watch_exit();
  }

  private _watch_exit() {
    process.once('SIGINT', () => {
      stdout.write('\n');
      stdout.clearScreenDown();
      this.server.close();
    });
  }

  private _generate_controllers = () => {
    Object.keys(controllers).forEach((key) => {
      const Controller = controllers[key];
      const controller = new Controller();
      this.server.add_controller(controller);
    });
  }

  start_watchers = async () => {
    await watch_docker();
  }

  boot = async () => {
    this._generate_controllers();
    await this.store.mount(this.store_path);
    await this.start_watchers();
  }

  listen = (host: string, port?: number) => {
    this.server.listen(host, port);
  }

  close = async () => {
    await this.server.close();
  }
}

export default Daemon;
