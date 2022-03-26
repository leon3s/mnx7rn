import type { HttpClient } from "../HttpClient";
import type { User, UserLoginReq, UserLoginRes } from "../../headers/user_interface.h";

export default function user_generator(c: HttpClient) {
  return {
    login: async (data: UserLoginReq) => {
      const res = await c.post<UserLoginRes>('/users/login', data);
      c.store.username = data.name;
      c.store.key = res.data.key;
      return res;
    },

    whoami: () => {
      const {username, key} = c.store as {username: string, key: string};
      const authorization_value = Buffer.from(`${username}:${key}`).toString('base64');
      const authorization = `RSA ${authorization_value}`;
      return c.get<User>('/users/whoami', {
        headers: {
          'authorization': authorization,
        }
      });
    },
  }
}
