import Server from '../../src/nxth7p';
import HttpCtrl from '../../src/nxth7p/HttpCtrl';
import { create_route } from '../../src/nxth7p/HttpRoute';

export const test_server = new Server();

class RootCtrl extends HttpCtrl {
  "GET /" = () => {
    const [route, bind_route] = create_route();
    bind_route(async () => {
      return {
        name: 'test_server',
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

  "POST /test_post" = () => {
    const [route, bind_route] = create_route();
    bind_route(async (req) => {
      return { body: req.p_body, pong: true };
    });
    return route;
  }

  "PATCH /test_patch" = () => {
    const [route, bind_route] = create_route();
    bind_route(async (req) => {
      return { body: req.p_body, pong: true };
    });
    return route;
  }

  "GET /{name}" = () => {
    const [route, bind_route] = create_route();
    bind_route(async (req) => {
      console.log('GET /{name}');
      return { pong: true };
    });
    return route;
  }
}

const root_ctrl = new RootCtrl();

test_server.add_controller(root_ctrl);
