import path from 'path';
import { stdout } from 'process';

import { Server } from '../lib/HttpServer';
// import mariadb from 'mariadb';

import { store } from './Store';
import controllers from './controllers';
import { watch_docker } from './watchers';

import type { Store } from './Store';
import { Socket } from 'net';


// class SQLDB {
//   private pool: mariadb.Pool;
//   private conn?: mariadb.PoolConnection;

//   constructor(opts: mariadb.PoolConfig) {
//     this.pool = mariadb.createPool(opts);
//   }

//   connect = async () => {
//     this.conn = await this.pool.getConnection();
//   }

//   query = (query: string | mariadb.QueryOptions, value?: any) => {
//     if (!this.conn) throw new Error('Error no connection enable please call .connect() method');
//     return this.conn.query(query, value);
//   }
// }

export type DaemonOpts = {
  store_path?: string;
}

class Daemon {
  server: Server;
  store: Store;
  store_path: string;
  docker_sock?: Socket;
  // sqldb: SQLDB;

  constructor(opts: DaemonOpts) {
    this.store_path = opts.store_path || path.join(__dirname, '../../store');
    this.server = new Server();
    this.store = store;
    // this.sqldb = new SQLDB({
    //   host: '127.0.0.1',
    //   user: 'root',
    //   password: 'root',
    // });
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

  private start_watchers = async () => {
    this.docker_sock = await watch_docker();
  }

  boot = async () => {
    this._generate_controllers();
    // await this.sqldb.connect();
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
