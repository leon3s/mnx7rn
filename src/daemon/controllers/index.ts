import {Ctrl} from "../../nxth7ps";

import { RootCtrl } from "./root";
import { NetworkCtrl } from "./network";
import { ContainerCtrl } from './container';

const controllers: Record<string, InstanceType<typeof Ctrl>> = {
  root_ctrl: new RootCtrl(),
  network_ctrl: new NetworkCtrl(),
  container_ctrl: new ContainerCtrl(),
};

export default controllers;
