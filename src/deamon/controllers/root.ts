import Ctrl from "../../nxth7p/Ctrl";
import { create_route } from "../../nxth7p/Route";

export class RootCtrl extends Ctrl {
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
    route.res.content.content_type = 'text/plain';
    bind_route(async () => {
      return { pong: true };
    });
    return route;
  }
}
