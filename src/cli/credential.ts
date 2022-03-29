import path from "path";
import { homedir } from "os";
import { existsSync } from "fs";
import { appendFile, readFile } from "fs/promises";

const home_dir = homedir();

export async function get_host_credential(host: string, user?: string) {
  const content = await readFile(
    path.join(home_dir, '.nanocl-credentials'),
    'utf-8',
  ).catch(() => {});
  if (!content || !content.length) {
    return null;
  }
  const regex = new RegExp(`(.*)\/\/(.*):(.*)@${host}`, 'g');
  const [ username, passwd ] = content.replace(regex, '$2:$3').split(':');
  return {
    username,
    passwd,
  };
}

export async function exists_credential() {
  return existsSync(path.join(home_dir, '.nanocl-credentials'));
}

export async function write_host_credential(url: InstanceType<typeof URL>, credential: string) {
  let {hostname} = url;
  if (hostname === ".") {
    hostname = `${hostname}${url.pathname}`;
  }
  const line = `${url.protocol}//${credential}@${hostname}\n`;
  await appendFile(
    path.join(home_dir, '.nanocl-credentials'),
    line,
  );
}
