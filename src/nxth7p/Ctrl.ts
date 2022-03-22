import type RouteConf from './Route';

export type CtrlBinder = () => RouteConf;

class Ctrl {
  path: string = '/';
  [props: string]: CtrlBinder | any;

  constructor(
    path = '/'
  ) {
    this.path = path;
  }
};

export default Ctrl;
