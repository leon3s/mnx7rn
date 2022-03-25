import type Store from "./store";

/**
 * Virtual environement
 */
class VeService {
  store: Store

  constructor(store: Store) {
    this.store = store;
  }
}

export default VeService;
