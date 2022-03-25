import {
  Ctrl,
  HttpRes,
  HttpErr,
  HttpMethodKey,
  HttpContentTypeEnum,
 } from './HttpRFC';
import {
  bind_p_sp,
  bind_p_body,
} from './req_bind';

import type { ServerResponse } from "http";
import type { RouteConf, HttpReqPartial, HttpReqParams } from "./HttpRFC";

class CtrlManager {
  ctrls: Record<string, Ctrl | null> = {};

  constructor() {
  }

  add = (ctrl: Ctrl) => {
    this.ctrls[ctrl.constructor.name] = ctrl;
  }

  ex_url_path = (s: string) => {
    return s.split('/').map((_s) => {
      if (!_s.length) return '/';
      return _s;
    });
  }

  ctrl_match_route = (user_paths: string[], req_paths: string[]): HttpReqParams | null => {
    let c_path = -1;
    let c_currpath = 0;
    let req_path: string;
    const route_vars: HttpReqParams = {};
    while (req_path = req_paths[++c_path]) {
      let user_path = user_paths[c_currpath];
      if (!user_path) break;
      if (user_path.startsWith('{')) {
        const name = user_path.replace(/{(.*)}/gm, '$1');
        if (name === '*') {
          route_vars.all = [...(route_vars.all || []), req_path];
          continue;
        }
        ++c_currpath;
        route_vars[name] = req_path;
        continue;
      }
      if (user_path !== req_path) {
        break;
      }
      ++c_currpath;
    }
    if ((c_currpath === user_paths.length) && (c_path === req_paths.length)) {
      return route_vars;
    }
    return null;
  }

  ctrl_get_routes = (ctrl: Ctrl) => {
    const keys = Object.keys(ctrl);
    return keys.filter((key) => {
      const isFound = HttpMethodKey.find((method) => {
        return key.startsWith(method);
      });
      return isFound;
    });
  }

  route_conf_find = (ctrl: Ctrl, req: HttpReqPartial): RouteConf | null => {
    let count = -1;
    let route: string;
    let route_conf: RouteConf | null = null;
    const routes = this.ctrl_get_routes(ctrl);
    while (route = routes[++count]) {
      if (!route.startsWith(req.method)) {
        continue;
      }
      const route_pathname = route.replace(`${req.method}`, '').trim();
      const route_paths = this.ex_url_path(route_pathname);
      const req_paths = this.ex_url_path(req.p_url.pathname);
      const route_vars = this.ctrl_match_route(route_paths, req_paths);
      if (route_vars) {
        req.p_params = route_vars;
        route_conf = ctrl[route]() as RouteConf;
        route_conf.pathname = req.p_url.pathname;
        break;
      }
    }
    return route_conf;
  }

  route_before = async (req: HttpReqPartial, route_conf: RouteConf) => {
    const { req: { body, search_params } } = route_conf;
    await bind_p_body(req, body);
    await bind_p_sp(req, search_params);
  }

  route_after = (route_conf: RouteConf, data: any) => {
    let res_body = data;
    const {res: {content, is_stream}} = route_conf;
    if (is_stream) {
      return null;
    }
    if (content.content_type === HttpContentTypeEnum.JSON) {
      res_body = JSON.stringify(data);
    }
    return new HttpRes({
      body: res_body,
      status_code: route_conf.res.status_code,
      content_type: route_conf.res.content.content_type || 'text/plain',
    });
  }

  route_conf_verify = (req: HttpReqPartial, route_conf?: RouteConf | null): RouteConf => {
    if (!route_conf) {
      throw new HttpErr({
        status_code: 404,
        message: `Route ${req.p_url.pathname} doesn't exist.`,
      });
    }
    return route_conf;
  }

  process_route = async (req: HttpReqPartial, res: ServerResponse): Promise<HttpRes|null> => {
    let count = -1;
    let ctrl_name: string;
    let route_conf: RouteConf | null = null;
    const ctrl_names = Object.keys(this.ctrls);
    while (ctrl_name = ctrl_names[++count]) {
      const ctrl: Ctrl|null = this.ctrls[ctrl_name];
      if (!ctrl) continue;
      route_conf = this.route_conf_find(ctrl, req);
      if (route_conf) {
        break;
      }
    }
    route_conf = this.route_conf_verify(req, route_conf);
    await this.route_before(req, route_conf);
    const data = await route_conf.fn(req, res);
    return this.route_after(route_conf, data);
  }
}

export default CtrlManager;
