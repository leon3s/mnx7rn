import HttpErr from "./HttpErr";
import HttpMd, { HttpMdKey } from './HttpMd';

import type { IncomingMessage } from "http"; 
import type { HttpRouteVar } from "./HttpRoute";

export default interface HttpReq extends IncomingMessage {
  method: HttpMd;
  p_body: any;
  p_url: URL;
  p_filter: any;
  p_params: HttpRouteVar;
};

export function parse_param_filter_json(req: HttpReq) {
  try {
    const filter = req.p_url.searchParams.get('filter');
    if (!filter) {
      req.p_filter = {};
      return;
    }
    req.p_filter = JSON.parse(filter, function (key, value) {
      if (!key.length && typeof value !== 'object') {
        throw new HttpErr({
          status_code: 400,
        });
      }
      return value;
    });
  } catch (err: any) {
    throw new HttpErr({
      details: err,
      status_code: err.status_code || 400,
      message: 'filter should be an object or an array',
    });
  }
}

export function parse_body_json(req: HttpReq) {
  let body = '';
  return new Promise<void>((resolve, reject) => {
    if (req.complete) {
      req.p_body = {};
      return resolve();
    }
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      try {
        const p_body = JSON.parse(body, function (key, value) {
          if (!key.length && typeof value !== 'object') {
            throw new HttpErr({
              status_code: 400,
            });
          }
          return value;
        });
        req.p_body = p_body;
        resolve();
      } catch (err: any) {
        reject(new HttpErr({
          details: err,
          status_code: 400,
          message: 'Error body is not a correct json',
        }));
      }
    });
    req.on('error', (err) => {
      reject(new HttpErr({
        status_code: 400,
        details: err,
      }));
    });
  });
}

export async function parse_request(req: IncomingMessage): Promise<HttpReq> {
  if (!req.method || !HttpMdKey.includes(req.method)) {
    throw new HttpErr({
      status_code: 405,
    });
  }
  const p_req = req as HttpReq;
  const url = (req.url || '').toString();
  p_req.p_url = new URL(`unix://${url}`);
  p_req.p_body = '';
  p_req.p_filter = ''
  return p_req;
}
