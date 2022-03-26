import type { Store } from "../store";

export class Service {
  store: Store;

  constructor(store: Store) {
    this.store = store;
  }
}
