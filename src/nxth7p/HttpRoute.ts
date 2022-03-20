import type { ServerResponse } from "http";
import type { HttpReq } from "./HttpReq";
import type HttpRes from "./HttpRes";

export interface HttpRoute {
}

export type RouteExec = (req: HttpReq, res: ServerResponse) =>
  Promise<HttpRes> | HttpRes;
