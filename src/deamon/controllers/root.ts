import { Ctrl, route_gen } from "../../nxth7ps";

export class RootCtrl extends Ctrl {
  "GET /" = () => {
    const [route, bind_route] = route_gen();
    bind_route(async () => {
      return {
        name: 'deamon',
      }
    });
    return route;
  }

  "GET /ping" = () => {
    const [route, bind_route] = route_gen();
    bind_route(async () => {
      return { pong: true };
    });
    return route;
  }
}
