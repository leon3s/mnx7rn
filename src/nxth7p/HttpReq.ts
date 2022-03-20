import { IncomingMessage } from "http"; 
import HttpErr from "./HttpErr";
import dbg from './debug';

import HttpRes from "./HttpRes";

export interface HttpReq extends IncomingMessage {
  p_body: any;
  p_url: URL;
};

export function parse_body(req: IncomingMessage) {
  let body = '';
  return new Promise((resolve, reject) => {
    if (req.complete) return resolve({});
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      if (!body.length) {
        return resolve({});
      }
      try {
        JSON.parse(body);
        resolve(body);
      } catch (err: any) {
        reject(new HttpErr({
          status_code: 500,
          ...err,
        }));
      }
    });
    req.on('error', (err) => {
      reject(new HttpErr({
        status_code: 500,
        ...err,
      }));
    })
  });
}

export async function parse_request(req: IncomingMessage): Promise<HttpRes> {
  const url = (req.url || '').toString();
  const response = new HttpRes({
    status_code: 200,
    content_type: 'application/json',
    body: JSON.stringify({
      pong: new Date(),
    }),
  });
  const parsed_url = new URL(`unix://${url}`);
  const parsed_body = await parse_body(req);
  dbg("request body %o", parsed_body);
  dbg("request url : %o", parsed_url);
  return response;
}
