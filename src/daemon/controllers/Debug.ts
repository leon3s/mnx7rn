import { Ctrl, route_gen } from "../../lib/HttpServer";

export default class DebugCtrl extends Ctrl {
  "GET /debug/ping" = () => {
    const [route, bind_route] = route_gen();
    bind_route(async () => {
      return { message: "pong" };
    });
    return route;
  }
}
