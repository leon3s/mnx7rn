#!/bin/env node

import {argv, stdout} from 'process';
import deamon from './deamon';

type CommandFn = (...args: any[]) => Promise<any> | any;

const commands: Record<string, CommandFn> = {
  deamon: async (host, port) => {
    let h_deamon = host || 'unix://./test.socket';
    deamon.listen(h_deamon, +(port || 0) || undefined);
    let d_listen = h_deamon;
    if (port) {
      d_listen = `http://${h_deamon}:${port}`;
    }
    stdout.write(
      `[${process.pid}] ` +
      `deamon listening on ` +
      d_listen + '\n'
    );
  }
}

function parse_argv() {
  let count = 2;
  console.log('hello !', argv);
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
