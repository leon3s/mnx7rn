import { Ctrl, route_gen } from "../../HttpServer";

export default class DebugCtrl extends Ctrl {
  "GET /" = () => {
    const [route, bind_route] = route_gen();
    bind_route(async () => {
      return {
        name: 'daemon',
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
