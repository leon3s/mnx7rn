import type { HttpClient } from "../HttpClient";

function set_authorization_header(c: HttpClient) {
  const {username, key} = c.store as {username: string, key: string};
  const authorization_value = Buffer.from(`${username}:${key}`).toString('base64');
  const authorization = `Basic ${authorization_value}`;
  c.b_headers['authorization'] = authorization;
}

export default function user_generator(c: HttpClient) {
  return {
    login: async (data: UserLoginReq) => {
      const res = await c.post<UserLoginRes>('/users/login', data);
      c.store.username = data.name;
      c.store.key = res.data.key;
      set_authorization_header(c);
      return res;
    },

    whoami: () => {
      return c.get<User>('/users/whoami');
    },
  }
}
