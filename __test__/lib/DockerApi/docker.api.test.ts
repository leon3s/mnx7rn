import DockerApi from '../../../src/lib/DockerApi';

const docker_api = new DockerApi('/var/run/docker.sock');

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
});
