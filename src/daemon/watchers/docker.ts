import { endianness } from "os";
import docker_api from "../api/docker";

export async function watch_docker() {
  const vres = await docker_api.system.version();
  console.log(vres.data);
  const en = endianness();
  console.log(en);
  const res = await docker_api.system.events();
  res.socket.on('data', (buffer) => {
    const payload_size = parseInt(buffer.slice(0, 5).toString('utf-8'), 16);
    const json = buffer.subarray(5, payload_size + 5).toString('utf-8');
    // const size = parseInt(code.toString('utf-8'), 16);
    console.log({
      payload_size,
      length: json.length,
    });
    console.log(JSON.parse(json));
    // console.log(code.toString('utf-8'));
    // console.log(JSON.parse(json));
  });
}
