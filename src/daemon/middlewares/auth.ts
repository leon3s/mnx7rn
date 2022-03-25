import { HttpErr, RouteMiddlewareConfig } from "../../lib/HttpServer";

const middleware_auth: RouteMiddlewareConfig = async (route_conf) => {
  return async (req, res) => {
    const authorize_h = req.headers['authorization'];
      if (!authorize_h) {
        throw new HttpErr({
        status_code: 401,
        message: 'unauthorized',
      });
    }
    console.log(route_conf);
    console.log(req.headers['authorization']);
  }
}

export default middleware_auth;
