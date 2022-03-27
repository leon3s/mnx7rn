import type { Service } from './Interface';
import type { Store, Model } from '../Store';

export interface VmModel {
  id: string;
  name: string;
  image: string;
  processor_type?: 'x86_64' | 'i386';
}

/**
 * Virtual machine
 */
export class VmService implements Service {
  store: Store;
  model: Model<VmModel>;

  constructor(store: Store) {
    this.store = store;
    this.model = store.model_create<VmModel>('vm', {
      props_uniq: ['name'],
    });
  }

  create = async (data: VmModel) => {
    return this.model.create(data);
  }

  start = (id_or_name: string) => {
  }
}
