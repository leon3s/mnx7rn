import HttpCtrl from "../../nxth7p/HttpCtrl";
import { create_route } from "../../nxth7p/HttpRoute";

export class RootCtrl extends HttpCtrl {
  "GET /" = () => {
    const [route, bind_route] = create_route();
    bind_route(async () => {
      return {
        name: 'deamon',
      }
    });
    return route;
  }

  "GET /ping" = () => {
    const [route, bind_route] = create_route();
    bind_route(async () => {
      return { pong: true };
    });
    return route;
  }
}
