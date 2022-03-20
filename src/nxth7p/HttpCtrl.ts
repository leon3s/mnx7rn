import { HttpMdKey } from './HttpMd';

import type HttpReq from "./HttpReq";
import type HttpRouteConf from './HttpRoute';
import type { HttpRouteVar } from "./HttpRoute";

export type HttpCtrlBinder = () => HttpRouteConf;

class HttpCtrl {
  path: string = '/';
  [props: string]: HttpCtrlBinder | any;

  constructor(path?: string) {
    this.path = path || '/';
  }

  match_paths = (route_paths: string[], req_paths: string[], route_var: HttpRouteVar = {}) => {
    let c_path = -1;
    let curr_path: string;
    while (curr_path = route_paths[++c_path]) {
      let req_path = req_paths[c_path];
      if (curr_path.startsWith('{')) {
        console.log(curr_path.replace(/{(.*)}/gm, '$1'));
        continue;
      }
      if (curr_path !== req_path) {
        break;
      }
    }
    return c_path === route_paths.length && c_path === req_paths.length;
  }

  extract_paths = (s: string) => {
    return s.split('/').map((_s) => {
      if (!_s.length) return '/';
      return _s;
    });
  }

  exe = (req: HttpReq): HttpRouteConf | null => {
    let count = -1;
    let route: string;
    let route_conf: HttpRouteConf | null = null;
    const routes = this.get_route();
    while (route = routes[++count]) {
      if (!route.startsWith(req.method)) {
        continue;
      }
      const route_pathname = route.replace(`${req.method}`, '').trim();
      const route_paths = this.extract_paths(route_pathname);
      const req_paths = this.extract_paths(req.p_url.pathname);
      const is_matching = this.match_paths(route_paths, req_paths);
      if (is_matching) {
        route_conf = this[route]() as HttpRouteConf;
        route_conf.pathname = req.p_url.pathname;
        break;
      }
    }
    return route_conf;
  }

  get_route = () => {
    const keys = Object.keys(this);
    return keys.filter((key) => {
      const isFound = HttpMdKey.find((method) => {
        return key.startsWith(method);
      });
      return isFound;
    });
  }
};

export default HttpCtrl;
