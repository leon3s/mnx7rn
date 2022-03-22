import path from 'path';
import axios from 'axios';
import {test_server} from './helper';

import type {
  AxiosInstance,
  AxiosError,
} from 'axios';

let api: AxiosInstance;

describe('[nxth7ps_ERRORS]', () => {
  beforeAll(() => {
    test_server.listen(`unix://${path.join(__dirname, './test-error.socket')}`);
    api = axios.create({
      socketPath: path.join(__dirname, './test-error.socket'),
    });
  });

  it('invoke [GET /networks/dd/eeds] expect 404', async () => {
    const res = await api.get('/networks/dd/eeds')
    .catch((err: AxiosError) => {
      expect(err?.response?.status).toBe(404);
    });
    expect(res).toBe(undefined);
  });

  it('invoke [GET /ping?filter=] expect 400', async () => {
    await api.get('/ping', {
      params: {
        filter: 9239103,
      }
    }).catch((err: AxiosError) => {
      expect(err?.response?.status).toBe(400);
    });
    await api.get('/ping', {
      params: {
        filter: '',
      }
    }).catch((err: AxiosError) => {
      expect(err?.response?.status).toBe(400);
    });
  });

  it('invote [POST /test_post] expect 400', async () => {
    await api.post('/test_post').catch((err: AxiosError) => {
      expect(err?.response?.status).toBe(400);
    });
    await api.post('/test_post', 'toto').catch((err: AxiosError) => {
      expect(err?.response?.status).toBe(400);
    });
  });

  afterAll(async () => {
    await test_server.close();
  });
});
