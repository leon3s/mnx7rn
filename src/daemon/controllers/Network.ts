import {
  Ctrl,
  route_gen,
  HttpContentTypeEnum,
} from "../../lib/HttpServer";

import { virtual_env_service } from '../services';

export default class NetworkCtrl extends Ctrl {
  "POST /virual-envs" = () => {
    const [route, bind_route] = route_gen();
    route.req.body.content_type = HttpContentTypeEnum.JSON;
    route.req.body.schema = {
      type: "object",
      properties: {
        name: {
          type: "string",
        },
      },
    };
    bind_route(async (req) => {
      return virtual_env_service.create(req.p_body);
    });
    return route;
  }
}
