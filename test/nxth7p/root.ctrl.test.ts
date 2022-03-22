import path from 'path';
import axios from 'axios';
import {test_server} from './helper';

import type {
  AxiosInstance,
} from 'axios';

let api: AxiosInstance;

describe('[nxth7ps_ROOT_CONTROLLER]', () => {
  beforeAll(() => {
    test_server.listen(`unix://${path.join(__dirname, './test.socket')}`);
    api = axios.create({
      socketPath: path.join(__dirname, './test.socket'),
    });
  });

  it('invoke [GET /] expect 200', async () => {
    const res = await api.get('/');
    expect(res.status).toBe(200);
    expect(res.data.name).toBe('test_server');
  });

  it('invoke [GET /ping] expect 200', async () => {
    const res = await api.get('/ping');
    expect(res.status).toBe(200);
    expect(res.data).toStrictEqual({ message: "pong" });
  });

  it('invoke [GET /ping?qs={message: "ping"}] expect 200', async () => {
    const res = await api.get('/ping', {
      params: {
        qs: {
          message: "ping",
        }
      }
    });
    expect(res.status).toBe(200);
    expect(res.data).toStrictEqual({
        message: "pong",
        qs: {
          message: "ping",
        }
      });
  });

  it('invoke [POST /test_post body: { ping: true }] expect 200', async () => {
    const res = await api.post('/test_post', {
      ping: true,
    });
    expect(res.status).toBe(200);
    expect(res.data).toStrictEqual({
      body: {
        ping: true,
      },
      pong: true,
    });
  });

  it('invoke [PATCH /test_patch body: { ping: true }] expect 200', async () => {
    const res = await api.patch('/test_patch', {
      ping: true,
    });
    expect(res.status).toBe(200);
    expect(res.data).toStrictEqual({
      body: {
        ping: true,
      },
      pong: true,
    });
  });

  it('invoke [GET /{name}] expect 200', async () => {
    const res = await api.get('/toto');
    expect(res.status).toBe(200);
    expect(res.data).toStrictEqual({
      params: {
        name: 'toto',
      },
      pong: true,
    });
  });

  it('invoke [GET /{name}/{test}] expect 200', async () => {
    const res = await api.get('/toto/tata');
    expect(res.status).toBe(200);
    expect(res.data).toStrictEqual({
      params: {
        name: 'toto',
        test: 'tata',
      },
      pong: true,
    });
  });

  afterAll(async () => {
    await test_server.close();
  });
});