import path from 'path';
import axios from 'axios';
import deamon from '../../src/deamon';

import type {
  AxiosInstance,
} from 'axios';

let api: AxiosInstance;

describe('[DEAMON_ROOT_CONTROLLER]', () => {
  beforeAll(() => {
    deamon.listen(`unix://${path.join(__dirname, './test-root-deamon.socket')}`);
    api = axios.create({
      socketPath: path.join(__dirname, './test-root-deamon.socket'),
    });
  });

  it('invoke [GET /] expect 200', async () => {
    const res = await api.get('/');
    expect(res.status).toBe(200);
    expect(res.data.name).toBe('deamon');
  });

  it('invoke [GET /ping] expect 200', async () => {
    const res = await api.get('/ping');
    expect(res.status).toBe(200);
    expect(res.data).toStrictEqual({ pong: true });
  });

  afterAll(async () => {
    await deamon.close();
  });
});
