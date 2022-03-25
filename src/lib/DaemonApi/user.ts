import type { HttpClient } from "../HttpClient";
import type { UserLoginReq, UserLoginRes } from "../../headers/user_interface.h";

export default function user_generator(c: HttpClient) {
  return {
    login: async (data: UserLoginReq) => {
      const res = await c.post<UserLoginRes>('/users/login', data);
      c.store.key = res.data.key;
      return res;
    }
  }
}
