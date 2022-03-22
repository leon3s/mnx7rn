import {
  HttpRes,
  HttpErr,
  HttpMethodKey,
  HttpContentTypeEnum,
 } from './HttpRFC';
import {
  parse_body_json,
  parse_param_filter_json,
} from './req_parser';

import type Ctrl from "./Ctrl";
import type RouteConf from "./Route";
import type { ServerResponse } from "http";
import type { HttpReqPartial, HttpReqParams } from "./HttpRFC";

class CtrlManager {
  ctrls: Ctrl[] = [];

  add = (ctrl: Ctrl) => {
    this.ctrls.push(ctrl);
  }

  match_paths = (route_paths: string[], req_paths: string[]): HttpReqParams | null => {
    let c_path = -1;
    let curr_path: string;
    const route_vars: HttpReqParams = {};
    while (curr_path = route_paths[++c_path]) {
      let req_path = req_paths[c_path];
      if (curr_path.startsWith('{')) {
        const name = curr_path.replace(/{(.*)}/gm, '$1');
        route_vars[name] = req_path;
        continue;
      }
      if (curr_path !== req_path) {
        break;
      }
    }
    if (c_path === route_paths.length && c_path === req_paths.length) {
      return route_vars;
    }
    return null;
  }

  extract_paths = (s: string) => {
    return s.split('/').map((_s) => {
      if (!_s.length) return '/';
      return _s;
    });
  }

  exec_ctrl = (ctrl: Ctrl, req: HttpReqPartial): RouteConf | null => {
    let count = -1;
    let route: string;
    let route_conf: RouteConf | null = null;
    const routes = this.get_ctrl_routes(ctrl);
    while (route = routes[++count]) {
      if (!route.startsWith(req.method)) {
        continue;
      }
      const route_pathname = route.replace(`${req.method}`, '').trim();
      const route_paths = this.extract_paths(route_pathname);
      const req_paths = this.extract_paths(req.p_url.pathname);
      const route_vars = this.match_paths(route_paths, req_paths);
      if (route_vars) {
        req.p_params = route_vars;
        route_conf = ctrl[route]() as RouteConf;
        route_conf.pathname = req.p_url.pathname;
        break;
      }
    }
    return route_conf;
  }

  get_ctrl_routes = (ctrl: Ctrl) => {
    const keys = Object.keys(ctrl);
    return keys.filter((key) => {
      const isFound = HttpMethodKey.find((method) => {
        return key.startsWith(method);
      });
      return isFound;
    });
  }

  exec_from_req = async (req: HttpReqPartial, res: ServerResponse): Promise<HttpRes> => {
    let count = -1;
    let ctrl: Ctrl;
    let route_conf: RouteConf | null = null;
    while (ctrl = this.ctrls[++count]) {
      route_conf = this.exec_ctrl(ctrl, req);
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
    if (route_conf.req.body.content_type === HttpContentTypeEnum.JSON) {
      await parse_body_json(req);
    }
    if (route_conf.req.filter.content_type === HttpContentTypeEnum.JSON) {
      parse_param_filter_json(req);
    }
    const res_data = await route_conf.fn(req, res);
    let res_body = res_data;
    if (route_conf.res.content.content_type === HttpContentTypeEnum.JSON) {
      res_body = JSON.stringify(res_data);
    }
    return new HttpRes({
      body: res_body,
      status_code: route_conf.res.status_code,
      content_type: route_conf.res.content.content_type,
    });
  }
}

export default CtrlManager;
