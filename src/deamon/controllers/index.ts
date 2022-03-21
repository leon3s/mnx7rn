import HttpCtrl from "../../nxth7p/HttpCtrl";
import { RootCtrl } from "./root.ctrl";

const controllers: Record<string, InstanceType<typeof HttpCtrl>> = {
  root_ctrl: new RootCtrl(),
};

export default controllers;
