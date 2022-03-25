import VeService from './ve';
import VmService from './vm';
import Store from './store';

const _store = new Store('./store');

export const store = _store;
export const ve_service = new VeService();
export const vm_service = new VmService(store);
