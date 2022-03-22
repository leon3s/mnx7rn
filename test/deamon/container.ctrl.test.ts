import path from 'path';
import axios from 'axios';
import deamon from '../../src/deamon';

import type {
  AxiosInstance,
} from 'axios';
import type {
  ContainerInfo, ContainerInspectInfo,
} from 'dockerode';

let api: AxiosInstance;

let container: ContainerInspectInfo;

describe('[DEAMON_CONTAINER_CONTROLLER]', () => {
  beforeAll(() => {
    deamon.listen(`unix://${path.join(__dirname, './test-deamon-container.socket')}`);
    api = axios.create({
      socketPath: path.join(__dirname, './test-deamon-container.socket'),
    });
  });

  it('invoke [GET /containers] expect 200', async () => {
    const res = await api.get('/containers');
    expect(res.data).toBeInstanceOf(Array);
    expect(res.data.length).toBe(0);
  });

  it('invoke [POST /containers] expect 200', async () => {
    const res = await api.post('/containers', {
      name: 'test',
      Image: 'nginx',
      HostConfig: {
        PortBindings: {
          "80/tcp": [
            {
              "HostIp": "",
              "HostPort": `1888/tcp`,
            }
          ],
        }
      }
    });
    container = res.data;
    console.log({container});
    expect(container.Name).toBe('/test');
  });

  it('invoke [GET /containers/{id_or_name} with Id] expect 200', async () => {
    const res = await api.get(`/containers/${container.Id}`);
    expect(res.data.Id).toBe(container.Id);
  });

  it('invoke [DELETE /containers/{id_or_name} with Id] expect 200', async () => {
    await api.delete(`/containers/${container.Id}`);
  });

  afterAll(async () => {
    await deamon.close();
  });
});
