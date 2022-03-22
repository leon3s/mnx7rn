import Server from '../../src/nxth7p';
import Ctrl from '../../src/nxth7p/Ctrl';
import { create_route } from '../../src/nxth7p/Route';

export const test_server = new Server();

class RootCtrl extends Ctrl {
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
    route.req.search_params.qs = {
      content_type: 'application/json'
    };
    bind_route(async (req) => {
      return { message: "pong", qs: req.p_sp.qs };
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
      return { pong: true, params: req.p_params };
    });
    return route;
  }

  "GET /{name}/{test}" = () => {
    const [route, bind_route] = create_route();
    bind_route(async (req) => {
      return { pong: true, params: req.p_params };
    });
    return route;
  }
}

const root_ctrl = new RootCtrl();

test_server.add_controller(root_ctrl);
