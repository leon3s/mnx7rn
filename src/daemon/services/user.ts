import { readFile, realpath, writeFile } from "fs/promises";
import path from "path";
import { rsa_4096_decrypt, rsa_4096_encrypt, rsa_4096_gen } from "../lib/rsa";
import { sha256 } from "../lib/sha256";

import type Store from "./store";
import type { Model } from './store';

export interface UserModel {
  id: string;
  name: string;
  passwd: string;
};

/**
 * User service
 */
class UserService {
  store: Store;
  model: Model<UserModel>;

  constructor(store: Store) {
    this.store = store;
    this.model = store.model_create<UserModel>('user', {
      props_uniq: ['name'],
    });
  }

  create = async (data: Partial<UserModel>) => {
    if (!data.passwd) {
      throw new Error(`passwd is required.`);
    }
    data.passwd = sha256(data.passwd);
    const user = await this.model.create(data);
    const [private_key, public_key] = rsa_4096_gen();
    const priv_p = path.join(this.model.path, user.id, 'priv.pem');
    const pub_p = path.join(this.model.path, user.id, 'pub.pem');
    await writeFile(priv_p, private_key);
    await writeFile(pub_p, public_key);
  }

  login  = async (data: Partial<UserModel>) => {
    if (!data.name) {
      throw new Error('name is required.');
    }
    if (!data.passwd) {
      throw new Error('passwd is required.');
    }
    const model = await this.model.find_by_id(data.name);
    const passwd = sha256(data.passwd);
    if (passwd !== model.passwd) {
      throw new Error('unauthorized.');
    }
    const pub_pem_p = await realpath(path.join(this.model.path, model.id, 'pub.pem'));
    return readFile(pub_pem_p, 'utf-8');
  }
}

export default UserService;
