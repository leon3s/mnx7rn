import {argv, stdout} from 'process';
import {deamon, network} from './commands';

import type {Commands} from './args_parser';

async function print_version() {
  stdout.write('nanocld version 1.0.0, build a224086\n');
}

async function main_print_help() {
  stdout.write(
    '\nUsage: nanocld [OPTIONS] COMMAND\n' +
    '\nOptions:\n' +
    '  version, -v, --version  Print version information and quit\n' +
    '  help, -h, --help        Print help information and quit\n' +
    '\nManagement Commands:\n' +
    '  network  Manage network\n'+
    '\nCommands:\n'+
    '  deamon   Start deamon\n' +
    '\nTo get more help with nanocld, check out our guides at https://nanocld.nxthat.com/guides/'
  );
  stdout.write('\n');
}

const commands: Commands = {
  deamon,
  network,
  '-v': print_version,
  'version': print_version,
  '--version': print_version,
  '-h': main_print_help,
  'help': main_print_help,
  '--help': main_print_help,
}

export function main() {
  let command = null;
  if (!argv[2]) {
    return main_print_help();
  }
  command = commands[argv[2]];
  if (!command) {
    stdout.write(`nanocld \`${argv[2]}\` is not a command try\n`);
    stdout.write('see \`nanocld --help\`\n')
    process.exit(1);
  }
  command(...[...argv].slice(3))
  .catch(() => {
    process.exit(1);
  });
};
