import {
  Ctrl,
  Server,
  route_gen,
  ContentTypeEnum,
} from '../src/HttpServer';

export const test_server = new Server();

class RootCtrl extends Ctrl {
  "GET /" = () => {
    const [route, bind_route] = route_gen();
    bind_route(async () => {
      return {
        name: 'test_server',
      }
    });
    return route;
  }

  "GET /ping" = () => {
    const [route, bind_route] = route_gen();
    route.req.search_params.qs = {
      content_type: 'application/json',
      schema: {
        type: 'object',
        properties: {
          message: {
            type: "string"
          }
        }
      }
    };
    bind_route(async (req) => {
      return { message: "pong", qs: req.p_sp.qs };
    });
    return route;
  }

  "POST /test_post" = () => {
    const [route, bind_route] = route_gen();
    route.req.body.content_type = ContentTypeEnum.JSON;
    route.res.status_code = 201;
    bind_route(async (req) => {
      return { body: req.p_body, pong: true };
    });
    return route;
  }

  "PATCH /test_patch" = () => {
    const [route, bind_route] = route_gen();
    route.req.body.content_type = ContentTypeEnum.JSON;
    route.res.status_code = 203;
    bind_route(async (req) => {
      return { body: req.p_body, pong: true };
    });
    return route;
  }

  "GET /files/{*}" = () => {
    const [route, bind_route] = route_gen();
    bind_route(async (req) => {
      return { message: 'gg' };
    });
    return route;
  }

  "GET /{name}" = () => {
    const [route, bind_route] = route_gen();
    bind_route(async (req) => {
      return { pong: true, params: req.p_params };
    });
    return route;
  }

  "GET /{name}/{test}" = () => {
    const [route, bind_route] = route_gen();
    bind_route(async (req) => {
      return { pong: true, params: req.p_params };
    });
    return route;
  }
}

const root_ctrl = new RootCtrl();

test_server.add_controller(root_ctrl);

export default test_server;
