import type { Service } from "./Interface";
import type { Model, Store } from "../Store";
import docker_api from "../api/docker";

/**
 * Virtual environement service
 */
export class VeService implements Service {
  store: Store;
  model: Model<VirtualEnv>;

  constructor(store: Store) {
    this.store = store;
    this.model = store.model_create<VirtualEnv>('ve', {
      props_uniq: ['name'],
    });
  }

  create = async (ve: VirtualEnvPartial) => {
    const network = await docker_api.networks.create({
      Name: ve.name,
    });
    console.log(network);
  }
}
