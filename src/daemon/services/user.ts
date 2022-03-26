import path from "path";
import {
  readFile,
  realpath,
  writeFile,
} from "fs/promises";

import type Store from "./store";
import type { Model } from './store';

import { hmac_sha256, rsa_4096_gen } from "../../lib/crypto";

import type {User} from '../../headers/user_interface.h';

/**
 * User service
 */
class UserService {
  store: Store;
  model: Model<User>;

  constructor(store: Store) {
    this.store = store;
    this.model = store.model_create<User>('user', {
      props_uniq: ['name'],
    });
  }

  create = async (data: Partial<User>): Promise<User> => {
    if (!data.passwd) {
      throw new Error(`passwd is required.`);
    }
    const user = this.model.generate(data);
    const priv_p = path.join(this.model.path, user.id, 'priv.pem');
    const pub_p = path.join(this.model.path, user.id, 'pub.pem');
    const [private_key, public_key] = rsa_4096_gen();
    user.passwd = hmac_sha256(data.passwd, private_key);
    const user_model = await this.model.create(user);
    await writeFile(priv_p, private_key);
    await writeFile(pub_p, public_key);
    return user_model;
  }
 
  get_priv_key_by_id = async (id: string) => {
    const pub_key_p = await realpath(path.join(this.model.path, id, 'priv.pem'));
    const public_key = await readFile(pub_key_p, 'utf-8');
    return public_key;
  }

  get_pub_key_by_id = async (id: string) => {
    const pub_key_p = await realpath(path.join(this.model.path, id, 'pub.pem'));
    const public_key = await readFile(pub_key_p, 'utf-8');
    return public_key;
  }

  login  = async (data: Partial<User>) => {
    if (!data.name) {
      throw new Error('name is required.');
    }
    if (!data.passwd) {
      throw new Error('passwd is required.');
    }
    const model = await this.model.find_by_id(data.name);
    const private_key = await this.get_priv_key_by_id(model.id);
    const passwd = hmac_sha256(data.passwd, private_key);
    if (passwd !== model.passwd) {
      throw new Error('unauthorized.');
    }
    return hmac_sha256(JSON.stringify({id: model.id }), passwd);
    // Old way with rsa signature
    // const sign = crypto.createSign('SHA256');
    // sign.update(JSON.stringify(model));
    // sign.end();
    // const signature = sign.sign(private_key);
    // return signature.toString('base64');
  }
}

export default UserService;
