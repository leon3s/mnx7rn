import {argv} from 'process';
import deamon from './deamon';

type CommandFn = (...args: any[]) => Promise<any> | any;

const commands: Record<string, CommandFn> = {
  deamon: async (host, port) => {
    deamon.listen('unix://./test.socket');
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
