import HttpContentType from './HttpContentType';

import type { ServerResponse } from "http";
import type HttpReq from "./HttpReq";

export type HttpRouteReq = {
  title?: string;
  body: {
    content_type: HttpContentType;
    schema?: any;
  },
  filter: {
    content_type: HttpContentType;
  },
}

export type HttpRouteVar = Record<string, string>;

export type HttpRouteRes = {
  title?: string;
  status_code: number;
  content: {
    content_type: HttpContentType;
    schema?: {},
  }
}

export type RouteConfGetter = () => [HttpRouteReq, HttpRouteRes];

export default class HttpRouteConf {
  req: HttpRouteReq;
  res: HttpRouteRes;
  fn?: HttpRouteExec;
  pathname: string;

  constructor(getter: RouteConfGetter) {
    const [req, res] = getter();
    this.req = req;
    this.res = res;
    this.pathname = '';
  }

  bind_route: HttpRouteBinder = (fn) => {
    this.fn = fn;
  }
};

export type HttpRouteExec = (req: HttpReq, res: ServerResponse) =>
  Promise<any>;

export type HttpRouteBinder = (fn: HttpRouteExec) => void;

export function create_route(): [HttpRouteConf, HttpRouteBinder] {
  const route_conf = new HttpRouteConf(() => [{
    filter: {
      content_type: HttpContentType.JSON,
    },
    body: {
      content_type: HttpContentType.JSON,
    }
  }, {
    status_code: 200,
    content: {
      content_type: HttpContentType.JSON,
    }
  }])
  return [route_conf, route_conf.bind_route];
};
