import type { Store } from "../store";
import type { Service } from "./interface";

/**
 * Virtual environement
 */
export class VeService implements Service {
  store: Store

  constructor(store: Store) {
    this.store = store;
  }
}
