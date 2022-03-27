import path from "path";
import { homedir } from "os";
import { readFile } from "fs/promises";

export async function get_host_credential(host: string) {
  const home_dir = homedir();
  const content = await readFile(
    path.join(home_dir, '.nanocl-credentials'),
    'utf-8',
  ).catch(() => {});
  if (!content || !content.length) {
    return null;
  }
  content.split('\n')
  .reduce((acc: null | Record<string, string>, line) => {
    if (!line.includes(host)) {
      return acc;
    }
    acc = {};
    // const [credential] = line.
    return acc;
  }, null);
}

export async function write_host_credential() {

}
