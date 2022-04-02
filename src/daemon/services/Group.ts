import type {
  Store,
  Model,
} from "../Store";
import type {
  Service,
} from "./Interface";

/**
 * User service
 */
export class GroupService implements Service {
  store: Store;
  model: Model<Group>;

  constructor(store: Store) {
    this.store = store;
    this.model = store.model_create<Group>('group', {
      props_uniq: ['name'],
    });
  }

  create = async (data: GroupCreateReq): Promise<Group> => {
    return this.model.create(data);
  }

  delete = async (id_or_name: string) => {
    return this.model.delete_by_id(id_or_name);
  }
}
