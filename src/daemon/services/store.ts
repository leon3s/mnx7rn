import path from 'path';
import crypto from 'crypto';
import fs_p from 'fs/promises';
import EventEmitter from 'events';

function gen_short_id() {
  return crypto.randomBytes(2).toString('hex').toLowerCase();
}

function gen_id() {
  return `${gen_short_id()}${gen_short_id()}`;
}

export type ModelItem<D = Record<string, any>> = D & {
  id: string;
}

export class Model<D> {
  path: string;

  constructor(s_path: string) {
    this.path = s_path;
  }

  private _gen_item_paths = (id: string) => {
    const dir_p = path.join(this.path, id);
    return {
      dir_p,
      data_p: path.join(dir_p, 'data.json'),
    }
  }

  private _read_item = async (id: string): Promise<ModelItem<D>> => {
    const {data_p} = this._gen_item_paths(id);
    const file_c = await fs_p.readFile(data_p, 'utf-8');
    return JSON.parse(file_c) as ModelItem<D>;
  }

  private _save_item = async (data: ModelItem<D>) => {
    const { dir_p, data_p } = this._gen_item_paths(data.id);
    await fs_p.mkdir(dir_p, { recursive: true });
    await fs_p.writeFile(data_p, JSON.stringify(data));
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  find = async (): Promise<ModelItem<D>[]> => {
    const ids = await fs_p.readdir(this.path);
    return Promise.all(ids.map(this._read_item));
  }

  find_by_id = async (id: string): Promise<ModelItem<D>> => {
    const {data_p} = this._gen_item_paths(id);
    const file_c = await fs_p.readFile(data_p, 'utf-8');
    const model = JSON.parse(file_c);
    return model;
  }

  create = async (data: Partial<ModelItem<D>>): Promise<ModelItem<D>> => {
    const data_c = {
      ...data,
      id: gen_id(),
    } as ModelItem<D>
    await this._save_item(data_c);
    return data_c;
  }

  update_by_id = async (id: string, data: Partial<ModelItem<D>>): Promise<ModelItem<D>> => {
    let data_ptr = await this._read_item(id);
    data_ptr = {
      ...data,
      ...data_ptr,
    }
    await this._save_item(data_ptr);
    return data_ptr;
  }

  delete_by_id = async (id: string): Promise<void> => {
    const {dir_p} = this._gen_item_paths(id);
    await fs_p.rm(dir_p, {
      force: true,
      recursive: true,
    });
  }
}

class Store {
  path: string;
  private _emitter: EventEmitter;
  models: Record<string, Model<any>> = {};

  constructor(s_path: string) {
    this.path = s_path;
    this._emitter = new EventEmitter();
  };

  mount = async () => {
    await fs_p.mkdir(this.path, {
      recursive: true,
    });
  }

  umount = async () => {
    await fs_p.rm(this.path, {
      recursive: true,
      force: true,
    });
  }

  model_create = <D>(name: string, schema?: any) => {
    const model = new Model<D>(path.join(this.path, name));
    this.models[name] = model;
    return model;
  }
};

export default Store;
