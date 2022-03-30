import DockerApi from "../../lib/DockerApi";

const docker_api = new DockerApi('/var/run/docker.sock');

export default docker_api;
