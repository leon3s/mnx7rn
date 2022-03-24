import path from 'path';
import axios from 'axios';
import daemon from '../../src/daemon';

import type {
  AxiosInstance,
} from 'axios';

let api: AxiosInstance;

describe('[DAEMON_ROOT_CONTROLLER]', () => {
  beforeAll(async () => {
    await daemon.boot();
    daemon.listen(`unix://${path.join(__dirname, './test-daemon-root.socket')}`);
    api = axios.create({
      socketPath: path.join(__dirname, './test-daemon-root.socket'),
    });
  });

  it('invoke [GET /] expect 200', async () => {
    const res = await api.get('/');
    expect(res.status).toBe(200);
    expect(res.data.name).toBe('daemon');
  });

  it('invoke [GET /ping] expect 200', async () => {
    const res = await api.get('/ping');
    expect(res.status).toBe(200);
    expect(res.data).toStrictEqual({ pong: true });
  });

  afterAll(async () => {
    await daemon.close();
  });
});
