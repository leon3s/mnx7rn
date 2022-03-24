import fs from 'fs';
import path from 'path';
import daemon from "../src/daemon";

const out_path = path.resolve('doc/daemon.md');

let c_ctrl = ''
Promise.all(daemon.ctrls.map((ctrl) => {
  const {name} = ctrl.constructor;
  c_ctrl += `# ${name}\n\n`;
  const routes = ctrl.get_routes();
  routes.forEach((route) => {
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
