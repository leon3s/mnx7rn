import type { IncomingMessage } from "http";

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

export type HttpReqParams = Record<string, string>;
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
  status_code: number;
  content_type: string;

  constructor(data: HttpRes) {
    this.body = data.body;
    this.status_code = data.status_code;
    this.content_type = data.content_type;
  }
};
