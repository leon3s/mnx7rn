import docker_api from "../api/docker";

export async function watch_docker() {
  const {socket} = await docker_api.system.events();
  socket.on('data', (buffer) => {
    const payload_size = parseInt(buffer.slice(0, 5).toString('utf-8'), 16);
    const json = buffer.subarray(5, payload_size + 5).toString('utf-8');
    console.log(JSON.parse(json));
  });
}
