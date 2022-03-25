import {Ctrl} from "../../HttpServer";

import RootCtrl from "./root";
import NetworkCtrl from "./network";

const controllers: Record<string, InstanceType<typeof Ctrl>> = {
  root_ctrl: new RootCtrl(),
  network_ctrl: new NetworkCtrl(),
};

export default controllers;
