import fs from 'fs';
import path from 'path';
import { exit } from 'process';
import daemon from "../src/daemon";
import type { Ctrl } from '../src/lib/HttpServer';

const out_path = path.resolve('doc/daemon.md');

(async function main() {
  let c_ctrl = '';
  await daemon.boot();

  await Promise.all(Object.keys(daemon.server.c_manager.ctrls).map((key) => {
  const ctrl = daemon.server.c_manager.ctrls[key] as Ctrl;
  console.log(ctrl);
  const {name} = ctrl.constructor;
  c_ctrl += `# ${name}\n\n`;
  const routes = daemon.server.c_manager.ctrl_get_routes(ctrl);
  routes.forEach((route: string) => {
    const c_route = ctrl[route]();
    c_ctrl += `## [${route}]\n`
    c_ctrl += '*accepted request*\n\n'
    c_ctrl += `\`\`\`json
${JSON.stringify(c_route.req, null, 2)}
\`\`\`\n\n`;
    c_ctrl += '*example response*\n\n'
    c_ctrl += `\`\`\`json
${JSON.stringify(c_route.res, null, 2)}
\`\`\`\n\n`;
  });
}));
fs.writeFileSync(out_path, c_ctrl);
})().catch((err) => {
  console.error(err);
  exit(1);
});
