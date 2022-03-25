import { HttpClient } from "../HttpClient";

import generator_ntwk from './Network';

/**
 * JSON encoded value of the filters
 * (a map[string][]string) to process on the networks list.
 * Available filters:
 */
export type GetNetworks = {
  /** Matches all or part of a network ID. */
  id?: string[];
  /** Matches a network's driver. */
  driver?: string[];
  /** Matches of a network label. */
  label?: string[];
  /** Matches all or part of a network name. */
  name?: string;
  /** Filters networks by scope */
  scope?: ["swarm"|"global"|"local"];
  /** Filters networks by type. The custom keyword returns all user-defined networks. */
  type?: ["custom"|"builtin"];
};

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
