import path from 'path';
import axios from 'axios';

import daemon from '../../src/daemon';

import type {
  AxiosInstance,
} from 'axios';
import type {NetworkInspectInfo} from 'dockerode';

let api: AxiosInstance;
let default_network: NetworkInspectInfo;
let test_network: NetworkInspectInfo;

describe('[DAEMON_NETWORK_CONTROLLER]', () => {
  beforeAll(async () => {
    await daemon.boot();
    daemon.listen(`unix://${path.join(__dirname, './test-daemon-network.socket')}`);
    api = axios.create({
      socketPath: path.join(__dirname, './test-daemon-network.socket'),
    });
  });

  it('invoke [GET /networks] expect 200', async () => {
    const res = await api.get('/networks');
    expect(res.status).toBe(200);
    const [host] = res.data;
    default_network = host;
    expect(host.Name).toBeDefined();
  });

  it('invoke [GET /networks/{id_or_name} with Id] expect 200', async () => {
    const res = await api.get(`/networks/${default_network.Id}`);
    expect(res.data.Id).toBe(default_network.Id);
  });

  it('invoke [GET /networks/{id_or_name} with Name] expect 200', async () => {
    const res = await api.get(`/networks/${default_network.Name}`);
    expect(res.data.Name).toBe(default_network.Name);
  });

  it('invoke [POST /networks] expect 200', async () => {
    const res = await api.post('/networks', {
      Name: 'test-network',
      IPAM: {
        Driver: "default",
        Config: [
          {
            "Subnet": "172.20.0.0/16",
            "IPRange": "172.20.10.0/24",
            "Gateway": "172.20.10.11"
          }
        ]
      },
    });
    test_network = res.data;
  });

  it('invoke [DELETE /networks/{id_or_name} with Id] expect 200', async () => {
    const res = await api.delete(`/networks/${test_network.Id}`);
    expect(res.data).toBe("Ok");
  });

  afterAll(async () => {
    await daemon.close();
  });
});
