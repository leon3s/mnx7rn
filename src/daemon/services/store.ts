/**
 * Custom Database system
 * Why ? To have a project without any additional libraries when running in production.
 * May have so problem if we write concurently ?
 */
import path from 'path';
import crypto from 'crypto';
import fs_p, { writeFile } from 'fs/promises';
import EventEmitter, {once} from 'events';
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'fs';
import { nextTick } from 'process';

async function protectTraversing(basePath: string, wantedPath: string) {
  const p = path.resolve(path.join(basePath, wantedPath));
  if (!p.includes(basePath)) {
    throw new Error('Error trying to write ouside of autorized directory.');
  }
  return p;
}

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

type ModelMetaPropUniq = Record<string, string>;

// Point to the ID
type ModelMeta = {
  props_uniq: Record<string, ModelMetaPropUniq>;
}

export type ModelItem<D = Record<string, any>> = D & {
  id: string;
} & Record<string, any>;

export class Model<D = Record<string, any>> {
  path: string;
  props_uniq?: string[];
  is_writing: boolean = false;
  e: EventEmitter;
  meta_p: string;
  meta: ModelMeta = {
    props_uniq: {},
  }

  constructor(opts: ModelOpts) {
    this.path = opts.path;
    this.meta_p = path.join(opts.path, 'meta.json');
    this.props_uniq = opts.props_uniq;
    this.e = new EventEmitter();
  }

  mount = async () => {
    await fs_p.mkdir(this.path, { recursive: true });
    await this._gen_meta();
  }

  private _gen_meta = async () => {
    if (existsSync(this.meta_p)) {
      this.meta = JSON.parse(readFileSync(this.meta_p, 'utf-8')) as ModelMeta;
    } else {
      let props_uniq: Record<string, ModelMetaPropUniq> = {};
      if (this.props_uniq) {
        this.props_uniq.forEach((prop) => {
          props_uniq[prop] = {};
        });
      }
      this.meta.props_uniq = props_uniq;
      writeFileSync(this.meta_p, JSON.stringify(this.meta));
    }
  }

  private _gen_item_paths = (id: string) => {
    const dir_p = path.join(this.path, id);
    return {
      dir_p,
      data_p: path.join(dir_p, 'data.json'),
    }
  }

  private _read_item = async (id: string): Promise<ModelItem<D>> => {
    if (this.is_writing) {
      await once(this.e, 'write_done');
    }
    const {dir_p} = this._gen_item_paths(id);
    await protectTraversing(this.path, dir_p);
    const file_c = await fs_p.readFile(path.join(dir_p, 'data.json'), 'utf-8');
    return JSON.parse(file_c) as ModelItem<D>;
  }

  private _write_item = async (data: ModelItem<D>) => {
    if (this.is_writing) {
      await once(this.e, 'write_done');
    }
    this.is_writing = true;
    const { dir_p, data_p } = this._gen_item_paths(data.id);
    await protectTraversing(this.path, dir_p).catch((err) => {
      this.is_writing = false;
      this.e.emit('write_done');
      throw err;
    });
    await fs_p.mkdir(dir_p, { recursive: true });
    await fs_p.writeFile(data_p, JSON.stringify(data));
    await new Promise<void>((resolve) =>
      nextTick(() => resolve()));
    this.is_writing = false;
    this.e.emit('write_done');
  }

  find = async (): Promise<ModelItem<D>[]> => {
    let ids = await fs_p.readdir(this.path);
    let items = await Promise.all(ids.map(async (id) => {
      const item = await this._read_item(id);
      return item;
    }));
    items = items.filter((item) => !!item);
    return items as ModelItem<D>[];
  }

  find_by_id = async (uniq: string): Promise<ModelItem<D>> => {
    let id = uniq;
    if (this.props_uniq) {
      this.props_uniq.forEach((prop) => {
        id = this.meta.props_uniq[prop][id];
      });
    }
    const file_c = await this._read_item(id || uniq);
    return file_c;
  }

  generate = (data: Partial<ModelItem<D>>) => {
    if (data.id) return data as ModelItem<D>;
    const data_c = {
      ...data,
      id: gen_id(),
    } as ModelItem<D>;
    return data_c;
  }

  create = async (data: Partial<ModelItem<D>>): Promise<ModelItem<D>> => {
    const data_c = this.generate(data);
    if (this.props_uniq) {
      const new_uniq_props = this.props_uniq.reduce((acc: Record<string, ModelMetaPropUniq>, prop) => {
        if (this.meta.props_uniq[prop][data_c[prop]]) {
          throw new Error(`${prop} already used.`);
        }
        acc[prop] = {
          [data_c[prop]]: data_c.id,
        }
        return acc;
      }, {});
      this.meta.props_uniq = new_uniq_props;
      await writeFile(this.meta_p, JSON.stringify(this.meta));
    }
    await this._write_item(data_c);
    return data_c;
  }

  update_by_id = async (id: string, data: Partial<ModelItem<D>>): Promise<ModelItem<D>> => {
    let data_ptr = await this._read_item(id);
    data_ptr = {
      ...data,
      ...data_ptr,
    }
    await this._write_item(data_ptr);
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
    await Promise.all(Object.keys(this.models).map(async (key) => {
      const model = this.models[key];
      await model.mount();
    }));
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
