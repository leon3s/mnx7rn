import { URL } from "url";
import { exit, stderr } from "process";

import prompt from "../../lib/prompt";
import { write_host_credential } from "../credential";

import daemon_api from "../daemon_api";

export default async function login() {
  const username = await prompt("username > ");
  const password = await prompt("password > ", { is_hidden: true });
  const res = await daemon_api.users.login({
    name: username.toString(),
    passwd: password.toString(),
  }).catch(({}) => {
    stderr.write('nanocl `login` failed\n');
    exit(1);
  });
  let host = daemon_api.c.socket_path || daemon_api.c.b_url;
  if (!host.startsWith('http')) {
    host = `unix://${host}`;
  }
  const url = new URL(host);
  await write_host_credential(url, `${username}:${res.data.key}`);
}
