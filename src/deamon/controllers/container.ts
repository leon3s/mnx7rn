import {
  Ctrl,
  HttpErr,
  route_gen,
  ContentTypeEnum
} from "../../nxth7ps";
import { docker_service } from "../services";

export class ContainerCtrl extends Ctrl {
  "GET /containers" = () => {
    const [route, bind_route] = route_gen();
    bind_route(async () => {
      return docker_service.containers_find();
    });
    return route;
  }

  "GET /containers/{id_or_name}" = () => {
    const [route, bind_route] = route_gen();
    bind_route(async (req) => {
      const {id_or_name} = req.p_params;
      return docker_service.containers_find_by_id_or_name(id_or_name);
    });
    return route;
  }

  "POST /containers" = () => {
    const [route, bind_route] = route_gen();
    route.req.body.content_type = ContentTypeEnum.JSON;
    bind_route(async (req) => {
      try {
        const container = await docker_service.containers_create(req.p_body);
        return container;
      } catch (err: any) {
        throw new HttpErr({
          status_code: err.statusCode || 400,
          details: err?.json?.message || 'Bad request',
        });
      }
    });
    return route;
  }

  "DELETE /containers/{id_or_name}" = () => {
    const [route, bind_route] = route_gen();
    bind_route(async (req) => {
      const {id_or_name} = req.p_params;
      return docker_service.containers_delete_by_id_or_name(id_or_name);
    });
    return route;
  }

  // "GET /containers/{id_or_name}/start" = () => {
  // }
}