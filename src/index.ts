import {argv} from 'process';
import deamon from './deamon';

type CommandFn = (...args: any[]) => Promise<any> | any;

const commands: Record<string, CommandFn> = {
  deamon: async (host, port) => {
    let h_deamon = host || 'unix://./test.socket';
    deamon.listen(h_deamon, port);
    console.log(`[${process.pid}] deamon listening on ${h_deamon}${port ? `:${port}` : ''}`);
  }
}

function parse_argv() {
  let count = 2;
  let command = null;
  while (argv[count]) {
    command = commands[argv[count]];
    if (command) {
      command(...[...argv].slice(3));
    }
    count += 1;
  }
}

function main() {
  parse_argv();
};

main();
