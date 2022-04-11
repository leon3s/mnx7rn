import UserCtrl from './User';
import DebugCtrl from "./Debug";
import NetworkCtrl from "./Network";
import NamepaceCtrl from './Namespace';

import type { Ctrl } from "../../lib/HttpServer";

const controllers: Record<string, typeof Ctrl> = {
  UserCtrl,
  DebugCtrl,
  NetworkCtrl,
  NamepaceCtrl,
};

export default controllers;
