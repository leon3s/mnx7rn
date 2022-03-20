import { RouteExec } from "./HttpRoute";

class HttpCtrl {
  path: string = '/';
  [props: string]: RouteExec | any;

  constructor(path?: string) {
    this.path = path || '/';
  }

  exec_route() {
    const keys = Object.keys(this);
    console.log(keys);
  }
};

export default HttpCtrl;
