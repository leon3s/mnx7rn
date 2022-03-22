import {HttpContentTypeEnum, HttpContentType} from './HttpRFC';

import type { ServerResponse } from "http";
import type { HttpReqPartial } from './HttpRFC';

export type RouteDataType = {
  schema?: any;
  content_type: HttpContentType;
}

export type RouteReq = {
  title?: string;
  body: RouteDataType;
  search_params: Record<string, RouteDataType>;
}

export type RouteVar = Record<string, string>;

export type RouteRes = {
  title?: string;
  status_code: number;
  content: RouteDataType;
}

export type RouteConfGetter = () => [RouteReq, RouteRes];

export default class RouteConf {
  req: RouteReq;
  res: RouteRes;
  pathname: string;
  fn: RouteExec = () =>
    new Promise<void>((resolve) => resolve());

  constructor(getter: RouteConfGetter) {
    const [req, res] = getter();
    this.req = req;
    this.res = res;
    this.pathname = '';
  }

  bind_route: RouteBinder = (fn) => {
    this.fn = fn;
  }
};

export type RouteExec = (req: HttpReqPartial, res: ServerResponse) =>
  Promise<any>;

export type RouteBinder = (fn: RouteExec) => void;

export function create_route(): [RouteConf, RouteBinder] {
  const route_conf = new RouteConf(() => [{
    search_params: {},
    body: {
      content_type: HttpContentTypeEnum.JSON,
    }
  }, {
    status_code: 200,
    content: {
      content_type: HttpContentTypeEnum.JSON,
    }
  }])
  return [route_conf, route_conf.bind_route];
};
