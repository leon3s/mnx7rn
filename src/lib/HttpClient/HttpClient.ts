import https from 'http';
import EventEmitter from 'events';
import type { Socket } from 'net';
import type { ClientRequest, IncomingHttpHeaders, IncomingMessage } from 'http';

type SearchParams = Record<string, any>;

const protocol_to_port: Record<string, number> = {
  'http': 80,
  'https': 443,
};

type HttpClientResponse<D> = {
  data: D;
  http_version: string;
  status_code: number;
  stream: https.IncomingMessage;
  socket: Socket;
  headers: IncomingHttpHeaders;
}

type HttpClientRequestArg = {
  url: string;
  method: string;
  sp?: SearchParams;
  is_stream?: boolean;
  headers?: IncomingHttpHeaders;
  socket_path?: string;
}

class HttpClientRequest {
  p_url: URL;
  method: string;
  socket_path?: string;
  c_req: ClientRequest;
  r_res?: IncomingMessage;
  is_stream?: boolean;
  emitter = new EventEmitter();
  body?: any;

  constructor(arg: HttpClientRequestArg, body?: any) {
    const {url, method, headers, socket_path, sp} = arg;
    this.body = body;
    this.method = method;
    this.socket_path = socket_path;
    this.is_stream = arg.is_stream;
    if (!socket_path) {
      this.p_url = new URL(url);
    } else {
      this.socket_path = socket_path;
      this.p_url = new URL(url, `unix://${socket_path}`);
      this.p_url.hostname = socket_path;
    }
    if (sp) this._add_sp(sp);
    const r_opts = this._get_r_opts(headers || {});
    this.c_req = https.request(r_opts, this._res_handler);
    this.c_req.once('error', error => {
      this.emitter.emit('error', error);
    });
  }

  private _add_sp = (sp: SearchParams) => {
    Object.keys(sp).forEach((key) => {
      const value = sp[key];
      this.p_url.searchParams.append(key, typeof value === 'object' ? JSON.stringify(value) : value);
    });
  }

  private _get_r_opts = (headers: IncomingHttpHeaders): https.RequestOptions => {
    return {
      headers: {
        'accept': 'application/json; text/*',
        'content-type': 'application/json',
        ...headers,
      },
      method: this.method,
      socketPath: this.socket_path,
      
      hostname: this.p_url.hostname,
      port: protocol_to_port[this.p_url.protocol],
      path: `${this.p_url.pathname}${this.p_url.search}`,
    }
  }

  private _res_handler = (res: IncomingMessage) => {
    this.r_res = res;
    if (this.is_stream) {
      return this.emitter.emit('fullfiled', res);
    }
    let r_b_res: Buffer = Buffer.from([]);
    res.on('data', (data: Buffer) => {
      r_b_res = Buffer.concat([r_b_res, data]);
    });
    res.on('end', () => {
      this.emitter.emit('fullfiled', r_b_res);
    });
    res.on('error', (error) => {
      this.emitter.emit('error', error);
    });
  }

  private _data_format = (r_b_res: Buffer, content_type?: string) => {
    let data: any = r_b_res;
    if (!content_type) return data;
    if (data?.length && content_type.startsWith('application/json')) {
      data = JSON.parse(data.toString());
    }
    if (content_type.startsWith('text/plain')) {
      data = data.toString();
    }
    if (content_type.startsWith('text/html')) {
      data = data.toString();
    }
    return data;
  }

  process = <D>(): Promise<HttpClientResponse<D>> => {
    let res: https.ClientRequest;
    return new Promise((resolve, reject) => {
      this.c_req.on('upgrade', (res, socket, head) => {
        const {
          headers,
          statusCode,
          httpVersion,
        } = res;
        return resolve({
          data: {} as D,
          stream: res,
          headers,
          socket,
          http_version: httpVersion,
          status_code: statusCode || 0,
        });
      });
      this.emitter.once('error', reject);
      this.emitter.once('fullfiled', (r_b_res: Buffer) => {
        if (!this.r_res) {
          return reject({
            message: 'unexpected error',
          });
        }
        const {
          headers,
          statusCode,
          httpVersion,
        } = this.r_res;
        const data = this._data_format(r_b_res, headers['content-type']);
        resolve({
          data,
          headers,
          stream: this.r_res,
          socket: this.r_res.socket,
          http_version: httpVersion,
          status_code: statusCode || 0,
        });
      });
      if (this.body) {
        this.c_req.write(JSON.stringify(this.body));
      }
      res = this.c_req.end();
    });
  }
}

type HttpClientArg = {
  b_url?: string;
  socket_path?: string;
  b_headers?: IncomingHttpHeaders;
}

type HttpClientOpts = {
  sp?: Record<string, any>;
  socket_path?: string;
  is_stream?: boolean;
  headers?: IncomingHttpHeaders;
}

export class HttpClient {
  /** Base Url */
  b_url: string = '';
  socket_path?: string;
  b_headers: IncomingHttpHeaders = {};
  store: Record<string, any> = {};

  constructor(arg?: HttpClientArg) {
    if (arg) {
      this.b_url = arg.b_url || '';
      this.socket_path = arg.socket_path;
      this.b_headers = arg.b_headers || {};
    }
  }

  private _gen_request_arg = (u_url: string, method: string, opts?: HttpClientOpts): HttpClientRequestArg => {
    const url = `${this.b_url}${u_url}`;
    let all_headers = this.b_headers;
    let r_sp = {};
    let r_socket_path = this.socket_path;
    if (opts) {
      const {headers, socket_path, sp} = opts;
      if (headers) {
        all_headers = Object.assign(all_headers, headers);
      }
      if (socket_path) {
        r_socket_path = socket_path;
      }
      if (sp) r_sp = sp;
    }
    return {
      url,
      method,
      sp: r_sp,
      headers: all_headers,
      socket_path: r_socket_path,
      is_stream: opts?.is_stream,
    }
  }

  private _process_gen_request = async <D = Buffer>(u_url: string, method: string, opts?: HttpClientOpts, data?: any) => {
    const arg_req = this._gen_request_arg(u_url, method, opts);
    let c_req: HttpClientRequest | null = new HttpClientRequest(arg_req, data);
    let r_res = await c_req.process<D>();
    if (r_res.status_code === 301 && r_res.headers.location) {
      r_res = await this.get(r_res.headers.location, opts);
      c_req = null;
      return r_res;
    }
    c_req = null;
    if (r_res.status_code >= 400 && r_res.status_code < 600) {
      throw r_res;
    }
    return r_res;
  }

  get = async <D = Buffer>(u_url: string, opts: HttpClientOpts = {}) => {
    return this._process_gen_request<D>(u_url, 'GET', opts);
  }

  post = async <D = Buffer>(u_url: string, data: any = null, opts: HttpClientOpts = {}) => {
    return this._process_gen_request<D>(u_url, 'POST', opts, data);
  }

  patch = async <D = Buffer>(u_url: string, data: any = null, opts: HttpClientOpts = {}) => {
    return this._process_gen_request<D>(u_url, 'PATCH', opts, data);
  }

  put = async <D = Buffer>(u_url: string, data: any = null, opts: HttpClientOpts = {}) => {
    return this._process_gen_request<D>(u_url, 'PUT', opts, data);
  }

  delete = async <D = Buffer>(u_url: string, opts: HttpClientOpts = {}) => {
    return this._process_gen_request<D>(u_url, 'DELETE', opts);
  }
}
