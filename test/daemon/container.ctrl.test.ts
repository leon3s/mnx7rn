import path from 'path';
import axios from 'axios';
import daemon from '../../src/daemon';

import type {
  AxiosInstance,
} from 'axios';
import type {
  ContainerInspectInfo,
} from 'dockerode';

let api: AxiosInstance;

let container: ContainerInspectInfo;

describe('[DAEMON_CONTAINER_CONTROLLER]', () => {
  beforeAll(async () => {
    await daemon.boot();
    daemon.listen(`unix://${path.join(__dirname, './test-daemon-container.socket')}`);
    api = axios.create({
      socketPath: path.join(__dirname, './test-daemon-container.socket'),
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
    await daemon.close();
  });
});
