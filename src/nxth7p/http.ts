import {createServer} from 'http';
import { parse_request } from './HttpReq';

/** TYPES */
import type {
  Server as HttpServer,
  IncomingMessage,
  ServerResponse,
} from 'http';
import type HttpErr from './HttpErr';
import HttpCtrl from './HttpCtrl';

class Server {
  host: string = '';
  port: number = 0;
  n_http: HttpServer;
  ctrls: HttpCtrl[] = [];

  constructor() {
    this.n_http = createServer(this._req_hander);
    this._watch_exit();
  }

  private _watch_exit = () => {
    process.on('SIGINT', () => {
      this.close();
    });

    process.on('exit', () => {
      this.close();
    });
  }

  add_controller = (ctrl: HttpCtrl) => {
    this.ctrls.push(ctrl);
  }

  private _req_hander = (req: IncomingMessage, res: ServerResponse) => {
    parse_request(req).then((response) => {
      res.statusCode = response.status_code;
      res.setHeader('content-type', response.content_type);
      res.end(response.body);
    }).catch((err: HttpErr) => {
      res.statusCode = err.status_code || 500;
      res.setHeader('content-type', 'application/json');
      res.end(err.body);
    });
  }

  close = () => {
    this.n_http.close();
  }

  listen = (host: string, port?: number) => {
    this.host = host;
    this.port = port || 0;
    let host_ptr = this.host;
    if (host.includes('unix://')) {
      host_ptr = host.replace('unix://', '');
    }
    this.n_http.listen(host_ptr, this.port);
  }
}

export default Server;
