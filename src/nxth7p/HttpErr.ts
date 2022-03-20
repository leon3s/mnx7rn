export default class HttpErr {
  body: string;
  status_code: number;
  [props: string]: any;

  constructor(error: Partial<HttpErr>) {
    this.status_code = error.status_code || 500;
    this.body = JSON.stringify({
      ...error,
      body: undefined,
      status_code: undefined,
    });
  }
}
