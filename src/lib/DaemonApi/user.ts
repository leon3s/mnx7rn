import type { HttpClient } from "../HttpClient";
import type { UserLoginRes } from "../../headers/user_interface.h";

export default function generator_user(c: HttpClient) {
  return {
    login: async () => {
      const res = await c.post<UserLoginRes>('/users/login', {
        name: 'root',
        passwd: 'root',
      });
      console.log(res);
    }
  }
}
