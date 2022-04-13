import { HttpClient } from "../HttpClient";
import user_generator from "./user";
import namespace_generator from './namespace';

class DaemonApi {
  private _c: HttpClient;
  users: ReturnType<typeof user_generator>;
  namespaces: ReturnType<typeof namespace_generator>;

  constructor(host?: string) {
    this._c = new HttpClient({
      socket_path: host,
    });
    this.users = user_generator(this._c);
    this.namespaces = namespace_generator(this._c);
  }
}

export default DaemonApi;
