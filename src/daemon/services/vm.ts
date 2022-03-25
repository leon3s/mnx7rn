import {spawn} from 'child_process';
import Store from './store';
import type {Model} from './store';

export interface VmModel {
  id: string;
  name: string;
  image: string;
  processor_type?: 'x86_64' | 'i386';
}

class VmService {
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
    // spawn()
  }
}

export default VmService;
