import docker_api from "../api/docker";
import { dbg_docker } from "../debug";

export async function watch_docker() {
  const {socket} = await docker_api.system.events();
  socket.on('data', (buffer) => {
    const payload_size = parseInt(buffer.slice(0, 4).toString('utf-8'), 16);
    const json = buffer.subarray(4, payload_size + 4).toString('utf-8');
    dbg_docker('daemon:docker system events :', json);
  });
  return socket;
}
