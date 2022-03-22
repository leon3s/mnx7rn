import HttpCtrl from "../../nxth7p/HttpCtrl";
import { create_route } from "../../nxth7p/HttpRoute";

import {docker_service} from '../services';

import HttpErr from "../../nxth7p/HttpErr";
import HttpContentType from "../../nxth7p/HttpContentType";

export class NetworkCtrl extends HttpCtrl {
  "GET /networks" = () => {
    const [route, bind_route] = create_route();
    bind_route(async () => {
      return docker_service.networks_find();
    });
    return route;
  }

  "GET /networks/{id_or_name}" = () => {
    const [route, bind_route] = create_route();
    bind_route(async (req) => {
      const {id_or_name} = req.p_params;
      return docker_service
        .networks_find_by_id_or_name(id_or_name);
    });
    return route;
  }

  "POST /networks" = () => {
    const [route, bind_route] = create_route();
    bind_route(async (req) => {
      try {
        const network = await docker_service.networks_create(req.p_body);
        return network;
      } catch (e: any) {
        throw new HttpErr({
          status_code: e.statusCode || 400,
          message: e?.json?.message || 'Bad request',
        })
      }
    });
    return route;
  }

  "DELETE /networks/{id_or_name}" = () => {
    const [route, bind_route] = create_route();
    bind_route(async (req) => {
      const {id_or_name} = req.p_params;
      await docker_service.networks_delete_by_id_or_name(id_or_name);
      return "Ok";
    });
    return route;
  }
}
