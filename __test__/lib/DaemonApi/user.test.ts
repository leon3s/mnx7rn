import path from 'path';
import Daemon from '../../../src/daemon';
import DaemonApi from '../../../src/lib/DaemonApi';
import { UserService } from '../../../src/daemon/services';

const socket_path = './user.test.sock';

const daemon_api = new DaemonApi(socket_path);

let test_user_id: string;

const daemon = new Daemon({
  store_path: path.join(__dirname, 'user.test.store'),
});

describe('[DEAMON API USER]', () => {
  beforeAll(async () => {
    await daemon.boot();
    const userservice = daemon.get_service<UserService>('userservice');
    const user = await userservice.create({
      name: 'root',
      passwd: 'root',
    });
    test_user_id = user.id;
    daemon.listen(socket_path);
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
    await daemon.store.umount();
    daemon.close();
  });
});
