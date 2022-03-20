import Server from '../nxth7p';
import HttpCtrl from '../nxth7p/HttpCtrl';
import { create_route } from '../nxth7p/HttpRoute';

const deamon = new Server();

class RootCtrl extends HttpCtrl {
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
    bind_route(async (req) => {
      return { pong: true, filter: req.p_filter };
    });
    return route;
  }
}

const root_ctrl = new RootCtrl();

deamon.add_controller(root_ctrl);

export default deamon;
