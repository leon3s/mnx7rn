import path from 'path';

import Store from '../../src/daemon/services/store';
import UserService from '../../src/daemon/services/user';

const store = new Store(path.join(__dirname, './test-store'));
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
