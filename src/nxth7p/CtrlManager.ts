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

  ex_url_path = (s: string) => {
    return s.split('/').map((_s) => {
      if (!_s.length) return '/';
      return _s;
    });
  }

  ctrl_match_route = (route_paths: string[], req_paths: string[]): HttpReqParams | null => {
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
    if (body.content_type === HttpContentTypeEnum.JSON) {
      await parse_body_json(req);
    }
    await Promise.all(Object.keys(search_params).map((key) => {
      const search_param = search_params[key];
      parse_param_filter_json(key, req);
    }));
  }

  route_after = (route_conf: RouteConf, data: any) => {
    let res_body = data;
    const {res: {content}} = route_conf;
    if (content.content_type === HttpContentTypeEnum.JSON) {
      res_body = JSON.stringify(data);
    }
    return new HttpRes({
      body: res_body,
      status_code: route_conf.res.status_code,
      content_type: route_conf.res.content.content_type,
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

  process_route = async (req: HttpReqPartial, res: ServerResponse): Promise<HttpRes> => {
    let count = -1;
    let ctrl: Ctrl;
    let route_conf: RouteConf | null = null;
    while (ctrl = this.ctrls[++count]) {
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
