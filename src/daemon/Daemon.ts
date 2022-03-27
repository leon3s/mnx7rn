import path from 'path';

import { Store } from './Store';
import services from './services';
import controllers from './controllers';

import { Server } from '../lib/HttpServer';

import type { Service } from './services';
import { stdout } from 'process';

export type DaemonOpts = {
  store_path?: string;
}

class Daemon {
  server: Server;
  store: Store;
  services: Record<string, InstanceType<typeof Service>> = {};

  constructor(opts: DaemonOpts) {
    this.server = new Server();
    this.store = new Store(opts.store_path || path.join(__dirname, '../../store'));
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
      const injector: Record<string, any> & typeof this.services = this.services;
      injector.store = this.store
      const controller = new Controller(injector);
      this.server.add_controller(controller);
    });
  }

  private _generate_services() {
    Object.keys(services).forEach((key) => {
      const Service = services[key];
      const service = new Service(this.store);
      this.services[key.toLowerCase()] = service as typeof service;
    });
  }

  get_service = <T extends Service>(name: string) => {
    return this.services[name] as T;
  }

  boot = async () => {
    this._generate_services();
    this._generate_controllers();
    await this.store.mount();
  }

  listen = (host: string, port?: number) => {
    this.server.listen(host, port);
  }

  close = async () => {
    await this.server.close();
  }
}

export default Daemon;
