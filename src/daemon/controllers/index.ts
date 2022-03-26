import UserCtrl from './user';
import DebugCtrl from "./debug";
import NetworkCtrl from "./network";

import type { Ctrl } from "../../lib/HttpServer";

const controllers: Record<string, typeof Ctrl> = {
  UserCtrl,
  DebugCtrl,
  NetworkCtrl,
};

export default controllers;
