import Dockerode from "dockerode";

import { HttpErr } from "../../nxth7p/HttpRFC";

import type {
  ContainerInfo,
  NetworkInspectInfo,
  NetworkCreateOptions,
  ContainerCreateOptions,
} from 'dockerode';

class DockerService {
  dockerode: Dockerode;
  
  constructor() {
    this.dockerode = new Dockerode({
      socketPath: '/var/run/docker.sock',
    });
  }

  networks_find = async (filter: Record<string, any> = {}) => {
    return this.dockerode.listNetworks({
      filters: JSON.stringify(filter),
    });
  }

  networks_find_by_id_or_name = async (id_or_name: string) => {
    let networks: NetworkInspectInfo[] = [];
    if (!id_or_name.length) {
      throw new HttpErr({
        status_code: 400,
      });
    }
    networks = await this.networks_find({
        id: [id_or_name],
    });
    if (networks.length) {
      if (networks[0].Id !== id_or_name) {
        throw new HttpErr({
          status_code: 404,
          message: `network with id_or_name ${id_or_name} not found`,
        });
      }
      return networks[0];
    }
    networks = await this.networks_find({
      name: [id_or_name],
    });
    if (!networks.length) {
      throw new HttpErr({
        status_code: 404,
        message: `network with id_or_name ${id_or_name} not found`,
      });
    }
    if (networks[0].Name !== id_or_name) {
      throw new HttpErr({
        status_code: 404,
        message: `network with id_or_name ${id_or_name} not found`,
      });
    }
    return networks[0];
  }

  networks_create = async (new_network: NetworkCreateOptions) => {
    /** Check for duplicate name */
    new_network.CheckDuplicate = true;
    const network = await this.dockerode.createNetwork(new_network);
    return network.inspect();
  }

  networks_delete_by_id_or_name = async (id_or_name: string) => {
    const info_network = await this.networks_find_by_id_or_name(id_or_name);
    const network = this.dockerode.getNetwork(info_network.Id);
    await network.remove();
  }

  containers_find = async (filter: Record<string, any> = {}) => {
    return this.dockerode.listContainers({
      all: true,
      filters: JSON.stringify(filter),
    });
  }

  containers_create = async (new_container: ContainerCreateOptions) => {
    const container = await this.dockerode.createContainer(new_container);
    const info_container = await container.inspect();
    return info_container;
  }

  containers_find_by_id_or_name = async (id_or_name: string) => {
    let containers: ContainerInfo[] = [];
    if (!id_or_name.length) {
      throw new HttpErr({
        status_code: 400,
      });
    }
    containers = await this.containers_find({
        id: [id_or_name],
    });
    if (containers.length) {
      if (containers[0].Id !== id_or_name) {
        throw new HttpErr({
          status_code: 404,
          message: `network with id_or_name ${id_or_name} not found`,
        });
      }
      return containers[0];
    }
    containers = await this.containers_find({
      name: [id_or_name],
    });
    if (!containers.length) {
      throw new HttpErr({
        status_code: 404,
        message: `network with id_or_name ${id_or_name} not found`,
      });
    }
    if (containers[0].Names[0] !== id_or_name) {
      throw new HttpErr({
        status_code: 404,
        message: `network with id_or_name ${id_or_name} not found`,
      });
    }
    return containers[0];
  }

  containers_delete_by_id_or_name = async (id_or_name: string) => {
    const info_container = await this.containers_find_by_id_or_name(id_or_name);
    const container = this.dockerode.getContainer(info_container.Id);
    if (info_container.State === 'running') {
      await container.stop();
    }
    await container.remove();
  }
}

export default DockerService;
