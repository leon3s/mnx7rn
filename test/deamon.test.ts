import axios from 'axios';
import deamon from '../src/deamon';
import type {AxiosInstance} from 'axios';

let api: AxiosInstance;

describe('deamon', () => {
  beforeAll(() => {
    deamon.listen('unix://./test.socket');
    api = axios.create({
      socketPath: './test.socket',
    });
  });

  it('invoke GET /networks', async () => {
    const res = await api.get('/networks/dd/eeds', {
      params: {
        filter: {
          ping: true,
        }
      }
    });
  });

  afterAll(() => {
    deamon.close();
  });
});
