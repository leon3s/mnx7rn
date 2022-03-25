import {
  HttpErr,
  HttpMethodKey,
  HttpContentTypeEnum,
} from './HttpRFC';
import schema_validate from './schema_validate';

import type { IncomingMessage } from "http";
import type {
  RouteReqSp,
  RouteDataType,
  HttpReqPartial,
  HttpContentType,
} from './HttpRFC';

function string_to_json(value: string) {
  try {
    return JSON.parse(value);
  } catch (err: any) {
    throw new HttpErr({
      status_code: 400,
      details: err.message,
    });
  }
}

function validate_content_type(req: HttpReqPartial, content_type: HttpContentType) {
  if (content_type !== req.headers['content-type']) {
    throw new HttpErr({
      status_code: 400,
      message: `Content Type not valid expected ${content_type}`,
    });
  }
}

export function bind_p_sp(req: HttpReqPartial, c_p_sp: RouteReqSp) {
  return new Promise<void>((resolve, reject) => {
    try {
      req.p_url.searchParams.forEach((value, name) => {
        const search_param = c_p_sp[name];
        let data = value;
        if (c_p_sp[name].content_type === HttpContentTypeEnum.JSON) {
          data = string_to_json(value);
        }
        if (search_param.schema) {
          schema_validate(data, search_param.schema);
        }
        req.p_sp[name] = data;
      });
      resolve();
    } catch (e) {
      reject(new HttpErr({
        status_code: 400,
        details: e,
      }));
    }
  });
}

export function bind_p_body(req: HttpReqPartial, c_body: RouteDataType) {
  let body = '';
  return new Promise<void>((resolve, reject) => {
    const {content_type, schema} = c_body;
    if (content_type) {
      validate_content_type(req, content_type);
    }
    if (req.complete) {
      req.p_body = {};
      return resolve();
    }
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      if (c_body.content_type !== HttpContentTypeEnum.JSON) {
        req.p_body = body;
        return resolve();
      }
      try {
        const p_body = string_to_json(body);
        if (schema) {
          schema_validate(p_body, schema);
        }
        req.p_body = p_body;
        resolve();
      } catch (err: any) {
        reject(new HttpErr({
          status_code: 400,
          details: err.details,
          message: 'Error body is not a correct json',
        }));
      }
    });
    req.on('error', (err) => {
      reject(new HttpErr({
        status_code: 400,
        details: err.message,
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
