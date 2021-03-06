import { stdout } from 'process';

import { Server } from '../lib/HttpServer';

import controllers from './controllers';
import { watch_docker } from './watchers';

import type { Socket } from 'net';

import sqldb from './datasources/mariadb';

class Daemon {
  server: Server;
  docker_sock?: Socket;

  constructor() {
    this.server = new Server();
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
    await this.start_watchers();
  }

  listen = (host: string, port?: number) => {
    this.server.listen(host, port);
  }

  close = async () => {
    await new Promise<void>((resolve) => {
      this.docker_sock?.end(() => {
        resolve();
      });
    });
    await sqldb.close();
    await this.server.close();
  }
}

export default Daemon;
