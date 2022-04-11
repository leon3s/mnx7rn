import path from 'path';
import { stdout } from 'process';

import { Server } from '../lib/HttpServer';

import { store } from './Store';
import controllers from './controllers';
import { watch_docker } from './watchers';

import type { Socket } from 'net';
import type { Store } from './Store';
import sqldb from './datasources/mariadb';

export type DaemonOpts = {
  store_path?: string;
}

class Daemon {
  server: Server;
  store: Store;
  store_path: string;
  docker_sock?: Socket;

  constructor(opts: DaemonOpts) {
    this.store_path = opts.store_path || path.join(__dirname, '../../store');
    this.server = new Server();
    this.store = store;
    this._watch_exit();
  }

  private _clean_exit(code: number) {
    stdout.write('\n');
    stdout.clearScreenDown();
    this.server.close();
    process.exit(code);
  }

  private _watch_exit() {
    process.once('SIGHUP', () => {
      this._clean_exit(129);
    });
    process.once('SIGINT', () => {
      this._clean_exit(130);
    });
    process.once('SIGTERM', () => {
      this._clean_exit(143);
    });
  }

  private _generate_controllers = () => {
    Object.keys(controllers).forEach((key) => {
      const Controller = controllers[key];
      const controller = new Controller();
      this.server.add_controller(controller);
    });
  }

  private start_watchers = async () => {
    this.docker_sock = await watch_docker();
  }

  boot = async () => {
    this._generate_controllers();
    await sqldb.connect();
    await this.store.mount(this.store_path);
    await this.start_watchers();
  }

  listen = (host: string, port?: number) => {
    this.server.listen(host, port);
  }

  close = async () => {
    if (this.docker_sock) {
      this.docker_sock.end();
    }
    await this.server.close();
  }
}

export default Daemon;
