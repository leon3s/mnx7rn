import {createServer} from 'http';

import dbg from './debug';
import { parse_body_json, parse_param_filter_json, parse_request } from './HttpReq';

/** TYPES */
import type {
  Server as HttpServer,
  IncomingMessage,
  ServerResponse,
} from 'http';
import HttpErr from './HttpErr';
import HttpRes from './HttpRes';
import type HttpCtrl from './HttpCtrl';
import type HttpReq from './HttpReq';
import type HttpRouteConf from './HttpRoute';
import HttpContentType from './HttpContentType';
import { once } from 'events';

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

    process.on('SIGTERM', () => {
      this.close();
    })

    process.on('exit', () => {
      this.close();
    });
  }

  private _exec_controllers = async (req: HttpReq, res: ServerResponse): Promise<HttpRes> => {
    let count = -1;
    let ctrl: HttpCtrl;
    let route_conf: HttpRouteConf | null = null;
    while (ctrl = this.ctrls[++count]) {
      route_conf = ctrl.exe(req);
      if (route_conf) {
        break;
      }
    }
    if (!route_conf) {
      throw new HttpErr({
        status_code: 404,
        message: `Route ${req.p_url.pathname} doesn't exist.`,
      });
    }
    if (!route_conf.fn) {
      throw new HttpErr({
        status_code: 500,
        message: `Error [${route_conf.pathname}] bind_route`
      });
    }
    if (route_conf.req.body.content_type === HttpContentType.JSON) {
      await parse_body_json(req);
    }
    if (route_conf.req.filter.content_type === HttpContentType.JSON) {
      parse_param_filter_json(req);
    }
    const res_data = await route_conf.fn(req, res);
    let res_body = res_data;
    if (route_conf.res.content.content_type === HttpContentType.JSON) {
      res_body = JSON.stringify(res_data);
    }
    return new HttpRes({
      body: res_body,
      status_code: route_conf.res.status_code,
      content_type: route_conf.res.content.content_type,
    });
  }

  private _req_hander = (req: IncomingMessage, res: ServerResponse) => {
    parse_request(req).then((p_req) => {
      dbg("processing request [%s]", req.url);
      return this._exec_controllers(p_req, res);
    }).then((p_res) => {
      dbg('responding request [%s] %o', req.url, p_res);
      res.statusCode = p_res.status_code || 200;
      res.setHeader('Content-Type', p_res.content_type || 'application/json');
      res.end(p_res.body);
    }).catch((err: HttpErr) => {
      dbg("error request [%s] [%o]", req.url, err);
      res.statusCode = err.status_code || 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(err.body);
    });
  }

  public add_controller = (ctrl: HttpCtrl) => {
    this.ctrls.push(ctrl);
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

export default Server;
