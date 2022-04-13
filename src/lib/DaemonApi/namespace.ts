import type { HttpClient } from "../HttpClient";

export default function user_generator(c: HttpClient) {
  return {
    create: async (data: NamespaceCreateArg) => {
      return c.post('/namespaces', data);
    },

    list: () => {
      return c.get('/namespaces');
    },

    delete: () => {
      return c.get<User>('/users/whoami');
    },
  }
}
