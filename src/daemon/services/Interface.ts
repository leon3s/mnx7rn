import type { Store } from "../Store";

export class Service {
  store: Store;

  constructor(store: Store) {
    this.store = store;
  }
}
