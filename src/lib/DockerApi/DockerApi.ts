import { HttpClient } from "../HttpClient";

import generator_ntwk from './network';
import generator_system from './system';
import generator_container from './container';

export default class DockerApi {
  private c: HttpClient;

  networks: ReturnType<typeof generator_ntwk>;
  system: ReturnType<typeof generator_system>;
  containers: ReturnType<typeof generator_container>;

  constructor(url: string) {
    this.c = new HttpClient({
      socket_path: url,
    });
    this.networks = generator_ntwk(this.c);
    this.system = generator_system(this.c);
    this.containers = generator_container(this.c);
  }
}
