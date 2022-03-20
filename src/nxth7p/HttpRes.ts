class HttpRes {
  status_code: number;
  content_type: string;
  body: string;

  constructor(data: HttpRes) {
    this.body = data.body;
    this.status_code = data.status_code;
    this.content_type = data.content_type;
  }
};

export default HttpRes;
