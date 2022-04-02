/**
 ** HTTP CLIENT IMPLEMENTATION FOR DOCKER v1.37 /containers
 */
import type { HttpClient } from "../HttpClient";

export default function generator(c: HttpClient) {
  return {
    create: async (name: string, data: ContainerCreateArg) => {
      return c.post<{Id: string}>('/containers/create', data, {
        sp: {
          name,
        },
      });
    },

    start: async (id: string) => {
      return c.post(`/containers/${id}/start`);
    },

    stop: async (id: string) => {
      return c.post(`/containers/${id}/stop`)
    },

    remove: async (id: string) => {
      return c.delete(`/containers/${id}`);
    },

    attach: async (id: string, filter?: any) => {
      return c.post(`/containers/${id}/attach`, null, {
        is_stream: true,
        headers: {
          Upgrade: "tcp",
          Connection: "Upgrade",
        },
        sp: {
          stream: true,
          stdout: true,
          stderr: true,
        },
      });
    },

    stats: async (id: string, filter?: any) => {
      return c.get(`/containers/${id}/stats`, {
        sp: filter,
      });
    },
  }
}
