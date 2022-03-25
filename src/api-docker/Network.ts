/**
 * HTTP CLIENT IMPLEMENTATION FOR DOCKER v1.37 /networks
 */
import type { HttpClient } from "../HttpClient";

/** Network scopes */
export type DockerNtwkScope = "swarm"|"global"|"local";

/** Network types */
export type DockerNtwkType = "custom"|"builtin";

export type DockerNtwkBase = {
  /** The network's name. */
  Name: string;
  /** Name of the network driver plugin to use. default "bridge" */
  Driver: string;
  /** Restrict external access to the network. */
  Internal: boolean;
  /** Globally scoped network is manually attachable by regular containers from workers in swarm mode. */
  Attachable: boolean;
  /** Ingress network is the network which provides the routing-mesh in swarm mode. */
  Ingress: boolean;
  /** Enable IPv6 on the network. */
  EnableIPv6: boolean;
  /** IPAM */
  IPAM: {
    /** Name of the IPAM driver to use. */
    Driver: string | "default",
    /** List of IPAM configuration options, specified as a map: */
    Config: [{
      Subnet: string;
      IPRange: string;
      Gateway: string;
      AuxAddress: string;
    }]
  };
  /** Driver-specific options, specified as a map. */
  Options: {
    "com.docker.network.bridge.default_bridge": boolean,
    "com.docker.network.bridge.enable_icc": boolean,
    "com.docker.network.bridge.enable_ip_masquerade": boolean,
    "com.docker.network.bridge.host_binding_ipv4": string,
    "com.docker.network.bridge.name": string,
    "com.docker.network.driver.mtu": number;
  },
  /** User-defined key/value metadata. */
  Labels: Record<string, string>;
}

export type DockerNtwk = DockerNtwkBase & {
  Id: string;
  Created: Date;
  Scope: DockerNtwkScope;
};

/**
 * JSON encoded value of the filters
 * (a map[string][]string) to process on the networks list.
 * Available filters:
 */
 export type NtwksListArg = {
  /** Matches all or part of a network ID. */
  id?: string[];
  /** Matches a network's driver. */
  driver?: string[];
  /** Matches of a network label. */
  label?: string[];
  /** Matches all or part of a network name. */
  name?: string;
  /** Filters networks by scope */
  scope?: [DockerNtwkScope];
  /** Filters networks by type. The custom keyword returns all user-defined networks. */
  type?: [DockerNtwkType];
};

export type NtwksCreateArg = Partial<DockerNtwkBase> & {
  Name: string;
  CheckDuplicate?: boolean;
};

export type NtwksInspectArg = {
  verbose?: boolean;
  scope?: DockerNtwkScope;
}

export default function generator(c: HttpClient) {
  return {
    list: async (filters: NtwksListArg = {}) => {
      return c.get<DockerNtwk>('/networks', {
        sp: {
          filters,
        }
      });
    },

    create: async (data: NtwksCreateArg) => {
      return c.post<{Id: string}>('/networks/create', data);
    },

    remove: async (id_or_name: string) => {
      return c.delete<void>(`/networks/${id_or_name}`);
    },

    inspect: async (id_or_name: string, sp?: NtwksInspectArg) => {
      return c.get<DockerNtwk>(`/networks/${id_or_name}`, {
        sp
      });
    }
  }
}
