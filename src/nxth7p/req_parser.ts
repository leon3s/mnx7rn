import {
  HttpErr,
  HttpMethodKey,
} from './HttpRFC';

import type { IncomingMessage } from "http";
import type { HttpReqPartial } from './HttpRFC';

export function parse_param_filter_json(key: string, req: HttpReqPartial) {
  try {
    const filter = req.p_url.searchParams.get(key);
    if (!filter) {
      req.p_sp = {};
      return;
    }
    req.p_sp[key] = JSON.parse(filter);
  } catch (err: any) {
    throw new HttpErr({
      details: err,
      status_code: err.status_code || 400,
      message: 'filter should be an object or an array',
    });
  }
}

export function parse_body_json(req: HttpReqPartial) {
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

export async function prepare_request(req: IncomingMessage): Promise<HttpReqPartial> {
  const p_req = req as HttpReqPartial;
  if (!req.method || !HttpMethodKey.includes(req.method)) {
    throw new HttpErr({
      status_code: 405,
    });
  }
  p_req.p_sp = {};
  p_req.p_body = '';
  const url = (req.url || '').toString();
  p_req.p_url = new URL(`unix://${url}`);
  return p_req;
}
