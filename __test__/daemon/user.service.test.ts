import path from 'path';

import { Store } from '../../src/daemon/Store';
import { UserService } from '../../src/daemon/services';

const store_path = path.join(__dirname, './user.service.store');

const store = new Store(store_path);
const user_service = new UserService(store);

describe('[USER_SERVICE]', () => {
  beforeAll(async () => {
    await store.mount();
  });

  it('invoke user.create()', async () => {
    await user_service.create({
      name: 'god',
      passwd: 'god',
    });
  });

  it('invoke user.login with correct params', async () => {
    const key_p = await user_service.login({
      name: 'god',
      passwd: 'god',
    });
    expect(key_p).toBeDefined();
  });

  it('invoke user.login with bad params', async () => {
    const key_p = await user_service.login({
      name: 'god',
      passwd: 'god2',
    }).catch((err) => {
      expect(err.message).toBe('unauthorized.');
    });
    expect(key_p).toBeUndefined();
  });

  afterAll(async () => {
    await store.umount();
  });
});
