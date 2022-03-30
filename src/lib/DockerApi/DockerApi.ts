import { HttpClient } from "../HttpClient";

import generator_ntwk from './network';

export default class DockerApi {
  c: HttpClient;
  networks: ReturnType<typeof generator_ntwk>;

  constructor(url: string) {
    this.c = new HttpClient({
      socket_path: url,
    });
    this.networks = generator_ntwk(this.c);
  }
}
