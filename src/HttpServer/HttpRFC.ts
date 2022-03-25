import type { IncomingMessage, ServerResponse } from "http";
import {SchemaObject} from './OpenApi';

/**
* @description Supported http content_type
*/
export type HttpContentType = "text/plain" | "application/json";

/**
* @description Supported http method
*/
export type HttpMethod = "GET" | "HEAD" | "POST" | "PUT" |
  "DELETE" | "CONNECT" | "OPTIONS" | "TRACE" | "PATCH";

/**
* @description Enum of supported http content_type
*/
export const HttpContentTypeEnum: Record<string, HttpContentType> = {
  TEXT: 'text/plain',
  JSON: 'application/json',
};

/**
* @description Enum of supported http method
*/
export const HttpMethodEnum: Record<string, HttpMethod> = {
  GET: 'GET',
  HEAD: 'HEAD',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  CONNECT: 'CONNECT',
  OPTIONS: 'OPTIONS',
  TRACE: 'TRACE',
  PATCH: 'PATCH',
};

/**
* @description Array of supported http method
*/
export const HttpMethodKey = Object.keys(HttpMethodEnum);

export type HttpReqParams = Omit<Record<string, string>, 'all'> & {
  all?: string[];
};

export type HttpReqSearchParams = Record<string, any>;
export type HttpReqBody = any | any[];

/**
* @description Partial http request before it send to route
*/
export interface HttpReqPartial extends IncomingMessage {
  p_url: URL;
  method: HttpMethod;
  p_body: HttpReqBody;
  p_params: HttpReqParams;
  p_sp: HttpReqSearchParams;
};

/**
* @description HttpErr constructor argument
*/
export type HttpErrCtorArg = {
  status_code: number;
} & Record<string, any>;

/**
* @description Http Error class Helper
*/
export class HttpErr {
  body: string;
  status_code: number;

  constructor(arg: HttpErrCtorArg) {
    this.status_code = arg.status_code || 500;
    this.body = JSON.stringify({
      ...arg,
      status_code: undefined,
    });
  }
}

/**
 * @description Default Http response
 */
export class HttpRes {
  body: string;
  is_stream?: boolean;
  status_code: number;
  content_type: string;

  constructor(data: HttpRes) {
    this.body = data.body;
    this.status_code = data.status_code;
    this.content_type = data.content_type;
  }
};

export type CtrlBinder = () => RouteConf;

export class Ctrl {
  path: string = '/';
  [props: string]: CtrlBinder | any;

  constructor(
    path = '/'
  ) {
    this.path = path;
  }
};

export type RouteMiddleWareRunner = (req: HttpReqPartial, res: ServerResponse) => Promise<void>;
export type RouteMiddlewareConfig = (route_conf: RouteConf) => Promise<RouteMiddleWareRunner>;

export type RouteDataType = {
  schema?: SchemaObject;
  content_type?: HttpContentType;
}

export type RouteReqSp = Record<string, RouteDataType>;

export type RouteReq = {
  title?: string;
  body: RouteDataType;
  status_code?: number;
  search_params: RouteReqSp;
  middlewares: RouteMiddlewareConfig[];
}

export type RouteVar = Record<string, string>;

export type RouteRes = {
  title?: string;
  status_code: number;
  content: RouteDataType;
  is_stream?: boolean;
}

export type RouteConfGetter = () => [RouteReq, RouteRes];

export class RouteConf {
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
