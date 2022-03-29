import path from 'path';
import axios from 'axios';

import Daemon from '../../src/daemon';

const socket_path = './debug.ctrl.sock';

const client = axios.create({
  socketPath: socket_path,
});

const daemon = new Daemon({store_path: path.join(__dirname, 'debug.ctrl.store')});

describe('DEBUG CONTROLLER', () => {
  beforeAll(async () => {
    await daemon.boot();
    daemon.listen(socket_path);
  });

  it('invoke [GET /debug/ping] expect 401', async () => {
    const res = await client.get('/debug/ping').catch((err) => {
      expect(err.response.status).toBe(401);
    });
    expect(res).toBeUndefined();
  });

  afterAll(async () => {
    await daemon.store.umount();
    daemon.close();
  });
});
