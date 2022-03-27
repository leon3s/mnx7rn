import path from "path";
import { homedir } from "os";
import { readFile } from "fs/promises";

export async function get_host_credential(host: string, user?: string) {
  const home_dir = homedir();
  const content = await readFile(
    path.join(home_dir, '.nanocl-credentials'),
    'utf-8',
  ).catch(() => {});
  if (!content || !content.length) {
    return null;
  }
  const regex = new RegExp(`(.*)\/\/(.*):(.*)@${host}`, 'g');
  const s = "https://leon3s:super_password@github.com"
  console.log(s.replace(regex, '$2:$3').split(':'));
}

// export async function write_host_credential(host, credential) {

// }
