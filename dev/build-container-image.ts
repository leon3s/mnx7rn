import { spawn } from "child_process";
import { stderr, stdout } from "process";

const pkg = require('../package.json');

// docker build -t shykes/myapp:1.0.2 -t shykes/myapp:latest .

const child = spawn('/bin/env', ['docker', 'build', '-t', `nanoc:${pkg.version}`, '-t', `nanoc:latest`, '.']);

child.stdout.pipe(stdout);
child.stderr.pipe(stderr);

child.on('error', (err) => {
  console.error(err.message);
  process.exit(1);
})

child.ref();
