import { Ctrl, route_gen } from "../../lib/HttpServer";
import { HttpContentTypeEnum } from "../../lib/HttpServer/HttpRFC";

import {middleware_auth} from '../middlewares';
import type { UserService } from "../services/user";

export default class DebugCtrl extends Ctrl {
  userservice: UserService;

  constructor({
    userservice
  } : {
    userservice: InstanceType<typeof UserService>
  }) {
    super();
    this.userservice = userservice;
  }

  "GET /debug" = () => {
    const [route, bind_route] = route_gen();
    route.req.middlewares.push(
      middleware_auth(this.userservice)
    );
    bind_route(async () => {
      return {
        name: 'daemon',
      }
    });
    return route;
  }

  "GET /debug/ping" = () => {
    const [route, bind_route] = route_gen();
    route.req.middlewares.push(
      middleware_auth(this.userservice)
    );
    route.req.search_params.msg = {
      content_type: HttpContentTypeEnum.JSON,
      schema: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
          },
        },
      },
    };
    bind_route(async () => {
      return { pong: true };
    });
    return route;
  }
}
