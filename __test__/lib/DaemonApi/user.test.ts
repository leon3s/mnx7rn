import daemon from '../../../src/daemon';
import DaemonApi from '../../../src/lib/DaemonApi';
import { store, user_service } from '../../../src/daemon/services';

const socket_path = './daemon-api-user.sock';

const daemon_api = new DaemonApi(socket_path);

let test_user_id: string;

describe('[DEAMON API USER]', () => {
  beforeAll(async () => {
    await daemon.boot();
    const user = await user_service.create({
      name: 'root',
      passwd: 'root',
    });
    test_user_id = user.id;
    daemon.listen('./daemon-api-user.sock');
  });

  it('[invoke] {daemon_api.users.login()} expect [200]', async () => {
    const res = await daemon_api.users.login({
      name: 'root',
      passwd: 'root',
    });
    expect(res.status_code).toBe(200);
    expect(res.data.key).toBeDefined();
  });

  it('[invoke] {daemon_api.users.whoiam()} expect [200]', async () => {
    const res = await daemon_api.users.whoami();
  });

  afterAll(async () => {
    await store.umount();
    daemon.close();
  });
});
