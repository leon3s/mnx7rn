import { once } from 'events';
import { createServer } from 'http';

import dbg from './debug';
import { HttpErr } from './HttpRFC';
import CtrlManager from './CtrlManager';
import {
  prepare_request,
} from './req_bind';

import type {
  ServerResponse,
  IncomingMessage,
  Server as HttpServer,
} from 'http';
import type { Ctrl } from './HttpRFC';

export class Server {
  host: string = '';
  port: number = 0;
  n_http: HttpServer;
  c_manager: CtrlManager;

  constructor() {
    this.n_http = createServer(this._req_hander);
    this.c_manager = new CtrlManager();
  }

  private _req_hander = (req: IncomingMessage, res: ServerResponse) => {
    prepare_request(req).then((p_req) => {
      dbg("processing request [%s]", req.url);
      return this.c_manager.process_route(p_req, res);
    }).then((p_res) => {
      dbg('responding request [%s] %o', req.url, p_res);
      if (!p_res) return;
      res.statusCode = p_res.status_code || 200;
      res.setHeader('Content-Type', p_res.content_type || 'application/json');
      res.end(p_res.body);
    }).catch((err: HttpErr | any) => {
      dbg("error request [%s] [%o]", req.url, err);
      res.statusCode = err.status_code || 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(err.body || JSON.stringify({ message: err.message }));
    });
  }

  public add_controller = (ctrl: Ctrl) => {
    this.c_manager.add(ctrl);
  }

  public close = async () => {
    this.n_http.close();
    await once(this.n_http, 'close');
  }

  public listen = (host: string, port?: number) => {
    this.host = host;
    this.port = port || 0;
    let host_ptr = this.host;
    if (host.includes('unix://')) {
      host_ptr = host.replace('unix://', '');
    }
    if (this.port) {
      this.n_http.listen(this.port, host_ptr);
      return;
    }
    this.n_http.listen(host_ptr);
  }
}
