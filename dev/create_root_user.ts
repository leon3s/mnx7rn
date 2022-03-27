import path from 'path';
import { stdout } from 'process';
import { Store } from '../src/daemon/Store';
import { UserService } from '../src/daemon/services';

const store = new Store(path.join(__dirname, '../store'));

(async function main() {
  const userservice = new UserService(store);
  await store.mount();
  await userservice.create({
    name: 'root',
    passwd: 'root',
  });
})().then(() => {
  stdout.write('done\n');
});
