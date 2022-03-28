import {
  Ctrl,
  route_gen,
} from "../../lib/HttpServer";

import { UserService } from "../services";

export default class NetworkCtrl extends Ctrl {
  userservice: UserService;

  constructor({
    userservice
  } : {
    userservice: InstanceType<typeof UserService>
  }) {
    super();
    this.userservice = userservice;
  }

  "POST /networks" = () => {
    const [route, bind_route] = route_gen();
    route.req.middlewares.push()
    return route;
  }
}
