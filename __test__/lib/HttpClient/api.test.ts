import path from 'path';

import {test_server} from '../../server_gen';
import {HttpClient} from '../../../src/lib/HttpClient';

let client: HttpClient;

const test_server_url = `${path.join(__dirname, './http-client.socket')}`;

describe('[HttpClient]', () => {
  beforeAll(() => {
    test_server.listen(test_server_url);
  });

  it('invoke new HttpClient()', () => {
    client = new HttpClient();
  });

  it('invoke client.get("https://google.com")', async () => {
    const res = await client.get<string>("https://google.com");
    expect(res.status_code).toBe(200);
    expect(res.data).toBeDefined();
  });

  it(`invoke new HttpClient(${path.basename(test_server_url)})`, () => {
    client = new HttpClient({
      socket_path: test_server_url
    });
  });

  it('invoke client.get("/ping")', async () => {
    const res = await client.get<{message: string}>('/ping');
    expect(res.status_code).toBe(200);
    expect(res.data).toBeDefined();
    expect(res.data.message).toBe("pong");
  });

  it('invoke client.get("/ping?msg={"message": "ping"}")', async () => {
    const res = await client.get<{
      message: string,
      qs: any,
    }>('/ping', {
      sp: {
        qs: {
          message: "ping",
        }
      }
    });
    expect(res.status_code).toBe(200);
    expect(res.data).toBeDefined();
    expect(res.data.message).toBe("pong");
    expect(res.data.qs.message).toBe('ping')
  });

  it('invoke client.post("/test_post {"message": "ping"}")', async () => {
    const res = await client.post<{
      pong: boolean,
      body: any,
    }>('/test_post', {
      message: "ping",
    });
    expect(res.status_code).toBe(201);
    expect(res.data).toBeDefined();
    expect(res.data.pong).toBe(true);
    expect(res.data.body.message).toBe('ping')
  });

  it('invoke client.patch("/test_post {"message": "ping"}")', async () => {
    const res = await client.patch<{
      pong: boolean,
      body: any,
    }>('/test_patch', {
      message: "ping",
    });
    expect(res.status_code).toBe(203);
    expect(res.data).toBeDefined();
    expect(res.data.pong).toBe(true);
    expect(res.data.body.message).toBe('ping')
  });

  afterAll(async () => {
    await test_server.close();
  });
});
