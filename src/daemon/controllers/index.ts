import UserCtrl from './User';
import DebugCtrl from "./Debug";
import NetworkCtrl from "./Network";

import type { Ctrl } from "../../lib/HttpServer";

const controllers: Record<string, typeof Ctrl> = {
  UserCtrl,
  DebugCtrl,
  NetworkCtrl,
};

export default controllers;
