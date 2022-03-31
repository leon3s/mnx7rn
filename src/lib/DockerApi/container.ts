/**
 * HTTP CLIENT IMPLEMENTATION FOR DOCKER v1.37 /containers
 */
 import type { HttpClient } from "../HttpClient";

 export default function generator(c: HttpClient) {
  return {
    list: async (filters: NtwksListArg = {}) => {
      return c.get<any>('/containers/json', {
        sp: {
          filters,
        }
      });
    },

    create: async (name: string, data: ContainerCreateArg) => {
      return c.post<{Id: string}>('/containers/create', data, {
        sp: {
          name,
        },
      });
    },

    start: async (name: string) => {
      return c.post(`/containers/${name}/start`);
    }
  }
}
