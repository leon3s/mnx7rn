import type { Store } from "../Store";
import type { Service } from "./Interface";

/**
 * Virtual environement
 */
export class VeService implements Service {
  store: Store

  constructor(store: Store) {
    this.store = store;
  }
}
