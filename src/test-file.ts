import HttpCtrl from "./nxth7p/HttpCtrl";
import { create_route } from "./nxth7p/HttpRoute";

import type { HttpRouteRes } from './nxth7p/HttpRoute';
import HttpContentType from "./nxth7p/HttpContentType";

type RootGetRes = HttpRouteRes<{
  name: string;
}>;

/**
 * @api_ctrl Root
 * */
export class RootCtrl extends HttpCtrl {
  /**
   * @api_route [GET /ping]
  */
  "GET /" = () => {
    const [
      route,
      bind_route,
    ] = create_route<RootGetRes>();
    bind_route(async () => {
      return {
        status_code: 200,
        content: {
          content_type: HttpContentType.JSON,
        },
        body: {
          name: 'deamon',
        }
      }
    });
    return route;
  }

  /**
   * @api_route [GET /ping]
  */
  "GET /ping" = () => {
    const [route, bind_route] = create_route();
    bind_route(async () => {
      return { message: 'pong' };
    });
    return route;
  }
}
