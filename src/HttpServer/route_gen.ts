import {
  RouteConf,
  HttpContentTypeEnum
} from './HttpRFC';

import type { RouteBinder } from './HttpRFC';

export default function route_gen(): [RouteConf, RouteBinder] {
  const route_conf = new RouteConf(() => [{
    body: {},
    search_params: {},
    middlewares: [],
  }, {
    status_code: 200,
    content: {
      content_type: HttpContentTypeEnum.JSON,
    }
  }])
  return [route_conf, route_conf.bind_route];
};
