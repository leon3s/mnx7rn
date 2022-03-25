import {Ctrl} from "../../HttpServer";

import UserCtrl from './user';
import DebugCtrl from "./debug";
import NetworkCtrl from "./network";

const controllers: Record<string, InstanceType<typeof Ctrl>> = {
  user_ctrl: new UserCtrl(),
  debug_ctrl: new DebugCtrl(),
  network_ctrl: new NetworkCtrl(),
};

export default controllers;
