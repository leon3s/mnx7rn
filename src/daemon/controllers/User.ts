import {
  Ctrl,
  HttpErr,
  route_gen,
  HttpContentTypeEnum,
} from "../../lib/HttpServer";
import { middleware_auth } from "../middlewares";

export default class UserCtrl extends Ctrl {
  "GET /users/whoami" = () => {
    const [route, bind_route] = route_gen();
    route.req.middlewares.push(
      middleware_auth()
    );
    bind_route(async (req) => {
      return req.p_user;
    });
    return route;
  }

  "POST /users/login" = () => {
    const [route, bind_route] = route_gen();
    route.req.body.content_type = HttpContentTypeEnum.JSON;
    route.req.body.schema = {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        passwd: {
          type: 'string',
        },
      },
    };
    bind_route(async (req) => {
      // const rsa_pub = await user_service.login({
      //   name: req.p_body.name,
      //   passwd: req.p_body.passwd,
      // }).catch(() => {
      //   throw new HttpErr({
      //     status_code: 401,
      //     message: 'unauthorized',
      //   });
      // });
      // return { key: rsa_pub };
    });
    return route;
  }
}
