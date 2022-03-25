/**
 * Custom Database system
 * Why ? To have a project without any additional libraries when running in production.
 * May have so problem if we write concurently
 */
import path from 'path';
import crypto from 'crypto';
import fs_p from 'fs/promises';
import EventEmitter, {once} from 'events';
import { nextTick } from 'process';

function gen_short_id() {
  return crypto.randomBytes(2).toString('hex').toLowerCase();
}

function gen_id() {
  return `${gen_short_id()}${gen_short_id()}`;
}

type ModelOpts = {
  name: string;
  path: string;
  props_uniq?: string[];
}

export type ModelItem<D = Record<string, any>> = D & {
  id: string;
} & Record<string, any>;

export class Model<D = Record<string, any>> {
  path: string;
  props_uniq?: string[];
  is_writing: boolean = false;
  e: EventEmitter;

  constructor(opts: ModelOpts) {
    this.path = opts.path;
    this.props_uniq = opts.props_uniq;
    this.e = new EventEmitter();
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
    const data_rp = await fs_p.realpath(data_p);
    const file_c = await fs_p.readFile(data_rp, 'utf-8');
    return JSON.parse(file_c) as ModelItem<D>;
  }

  private _save_item = async (data: ModelItem<D>) => {
    if (this.is_writing) {
      await once(this.e, 'write_done');
    }
    this.is_writing = true;
    const { dir_p, data_p } = this._gen_item_paths(data.id);
    await fs_p.mkdir(dir_p, { recursive: true });
    await fs_p.writeFile(data_p, JSON.stringify(data));
    this.is_writing = false;
    await new Promise<void>((resolve) =>
      nextTick(() => resolve()));
    this.e.emit('write_done');
  }

  private _is_link = async (link_p: string) => {
    return new Promise((resolve, reject) => {
      fs_p.lstat(link_p).then(() =>
        resolve(true)
      ).catch((err) => {
        return resolve(false);
      })
    });
  }

  private _link_exist = async (link_p: string) => {
    return new Promise<boolean>((resolve, reject) => {
      fs_p.lstat(link_p).then(() =>
        resolve(true)
      ).catch((err) => {
        if (err.code === 'ENOENT') {
          return resolve(false);
        }
        return reject(err);
      });
    });
  }

  private _save_link = async (data: ModelItem<D>, key: string) => {
    const {dir_p} = this._gen_item_paths(data.id);
    const link_p = path.join(this.path, data[key]);
    const link_exists = await this._link_exist(link_p);
    if (link_exists) {
      throw new Error(`${key} is not uniq`);
    }
    await fs_p.symlink(dir_p, link_p);
  }

  find = async (): Promise<ModelItem<D>[]> => {
    let ids = await fs_p.readdir(this.path);
    let items = await Promise.all(ids.map(async (id) => {
      const is_link = await this._is_link(id);
      if (!is_link) return null;
      const item = await this._read_item(id);
      return item;
    }));
    items = items.filter((item) => !!item);
    return items as ModelItem<D>[];
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
    } as ModelItem<D>;
    await this._save_item(data_c);
    if (this.props_uniq) {
      await Promise.all(this.props_uniq.map((prop) => {
        return this._save_link(data_c, prop);
      }));
    }
    return data_c;
  }

  update_by_id = async (id: string, data: Partial<ModelItem<D>>): Promise<ModelItem<D>> => {
    let data_ptr = await this._read_item(id);
    const keys_u = Object.keys(data);
    
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
  models: Record<string, Model<any>> = {};

  constructor(s_path: string) {
    this.path = s_path;
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

  model_create = <D = Record<string, any>>(name: string, opts?: Partial<ModelOpts>) => {
    const model_p = path.join(this.path, name);
    const model_opts = {
      ...(opts || {}),
      name,
      path: model_p,
    };
    const model = new Model<D>(model_opts);
    this.models[name] = model;
    return model;
  }
};

export default Store;
