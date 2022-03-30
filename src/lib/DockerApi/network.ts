/**
 * HTTP CLIENT IMPLEMENTATION FOR DOCKER v1.37 /networks
 */
import type { HttpClient } from "../HttpClient";

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
