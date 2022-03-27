import { exit, stderr, stdin } from "process";
import prompt from "../../lib/prompt";

import daemon_api from "../daemon_api";

function store_credential() {
}

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
  console.log(res.data.key);
}
