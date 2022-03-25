import { HttpClient } from "../HttpClient";
import user_generator from "./user";

class DaemonApi {
  c: HttpClient;
  users: ReturnType<typeof user_generator>;

  constructor(host?: string) {
    this.c = new HttpClient({
      socket_path: host,
    });
    this.users = user_generator(this.c);
  }
}

export default DaemonApi;
