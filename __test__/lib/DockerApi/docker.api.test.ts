import { once } from 'events';
import { IncomingMessage } from 'http';
import { stdout } from 'process';
import { Duplex, Stream } from 'stream';
import DockerApi from '../../../src/lib/DockerApi';

const docker_api = new DockerApi('/var/run/docker.sock');

let container: any;

jest.setTimeout(50000);

describe('[DOCKER API]', () => {
  it('invoke docker_api.networks.list()', async () => {
    const res = await docker_api.networks.list();
    expect(res.status_code).toBe(200);
  });

  it('invoke docker_api.networks.create({ Name: "test-network" })', async () => {
    const res = await docker_api.networks.create({
      Name: 'test-network',
    });
    expect(res.status_code).toBe(201);
  });

  it('invoke docker_api.networks.inspect("test-network")', async () => {
    const res = await docker_api.networks.inspect("test-network");
    expect(res.data.Name).toBe("test-network");
    expect(res.status_code).toBe(200);
  });
  
  it('invoke docker_api.networks.remove("test-network")', async () => {
    const res = await docker_api.networks.remove('test-network');
    expect(res.status_code).toBe(204);
  });

  it('invoke docker_api.containers.create("testctn")', async () => {
    const res = await docker_api.containers.create('testctn', {
      Image: 'nginx:latest',
    });
    container = res.data;
    expect(res.data.Id).toBeDefined();
    expect(res.status_code).toBe(201);
  });

  it('invoke docker_api.containers.start(Id)', async () => {
    const res = await docker_api.containers.start(container.Id);
    expect(res.status_code).toBe(204);
  });

  it('invoke docker_api.containers.attach(Id)', async () => {
    const res = await docker_api.containers.attach(container.Id);
    expect(res.status_code).toBe(101);
    res.socket.on('data', (data) => {
      expect(data.toString()).toBeDefined();
    });
    setTimeout(() => {
      res.socket.destroy();
    }, 2000);
    await once(res.socket, 'close');
  });

  it('invoke docker_api.containers.stats(Id)', async () => {
    const res = await docker_api.containers.stats(container.Id, {
      stream: false,
    });
    expect(res.status_code).toBe(200);
  });

  it('invoke docker_api.containers.stop(Id)', async () => {
    const res = await docker_api.containers.stop(container.Id);
    expect(res.status_code).toBe(204);
  });

  it('invoke docker_api.containers.remove(Id)', async () => {
    const res = await docker_api.containers.remove(container.Id);
    expect(res.status_code).toBe(204);
  });
});
