import VeService from './ve';
import VmService from './vm';
import UserService from './user';
import Store from './store';

const _store = new Store('./store');

export const store = _store;
export const vm_service = new VmService(store);
export const ve_service = new VeService(store);
export const user_service = new UserService(store);
