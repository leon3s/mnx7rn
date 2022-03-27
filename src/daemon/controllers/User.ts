import { Ctrl, route_gen } from "../../lib/HttpServer";
import { HttpContentTypeEnum } from "../../lib/HttpServer/HttpRFC";
import { middleware_auth } from "../middlewares";

import type { UserService } from "../services/User";

export default class UserCtrl extends Ctrl {
  userservice: InstanceType<typeof UserService>;

  constructor({
    userservice
  } : {
    userservice: InstanceType<typeof UserService>
  }) {
    super();
    this.userservice = userservice;
  }

  "GET /users/whoami" = () => {
    const [route, bind_route] = route_gen();
    route.req.middlewares.push(
      middleware_auth(this.userservice)
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
      const rsa_pub = await this.userservice.login({
        name: req.p_body.name,
        passwd: req.p_body.passwd,
      });
      return { key: rsa_pub };
    });
    return route;
  }
}
