import axios from 'axios';
import daemon from '../../src/daemon';

const socket_path = './debug.ctrl.test.socket';

const client = axios.create({
  socketPath: socket_path,
});

describe('DEBUG CONTROLLER', () => {
  beforeAll(async () => {
    await daemon.boot();
    daemon.listen(socket_path);
  });

  it('invoke [GET /debug] expect 401', async () => {
    const res = await client.get('/debug').catch((err) => {
      expect(err.response.status).toBe(401);
    });
    expect(res).toBeUndefined();
  });

  afterAll(() => {
    daemon.close();
  });
});
