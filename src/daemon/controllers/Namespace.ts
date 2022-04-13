import {
  Ctrl,
  route_gen,
  HttpContentTypeEnum,
} from "../../lib/HttpServer";
import sqldb from "../datasources/mariadb";

export default class NamepaceCtrl extends Ctrl {
  "POST /namespaces" = () => {
    const [route, bind_route] = route_gen();
    route.req.body.content_type = HttpContentTypeEnum.JSON;
    route.req.body.schema = {
      type: "object",
      properties: {
        name: {
          type: "string",
        },
      },
    };
    bind_route(async (req) => {
      const res = await sqldb.query("INSERT INTO `namespace` (`name`) VALUES (?)", [
        req.p_body.name,
      ]);
      console.log(res);
      return res;
    });
    return route;
  }

  "GET /namespaces" = () => {
    const [route, bind_route] = route_gen();
    route.req.search_params = {
      filter: {
        content_type: HttpContentTypeEnum.JSON,
        schema: {
          type: "object",
          properties: {
            name: {
              type: "string"
            }
          }
        }
      }
    }
    bind_route(async () => {
      const res = await sqldb.query("SELECT * FROM namespace");
      console.log(res);
      return res;
    });
    return route;
  }
}
