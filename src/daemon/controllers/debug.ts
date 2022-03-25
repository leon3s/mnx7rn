import { Ctrl, route_gen } from "../../HttpServer";
import { HttpContentTypeEnum } from "../../HttpServer/HttpRFC";

import {middleware_auth} from '../middlewares';

export default class DebugCtrl extends Ctrl {
  "GET /debug" = () => {
    const [route, bind_route] = route_gen();
    route.req.middlewares.push(middleware_auth);
    bind_route(async () => {
      return {
        name: 'daemon',
      }
    });
    return route;
  }

  "GET /debug/ping" = () => {
    const [route, bind_route] = route_gen();
    route.req.middlewares.push(middleware_auth);
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
