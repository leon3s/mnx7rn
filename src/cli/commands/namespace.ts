import {
  exit,
  stdout,
} from 'process';
import args_parser from '../args_parser';

import type { Commands } from '../args_parser';
import daemon_api from '../daemon_api';

function print_help() {
  stdout.write(`
Usage:  nanocl namespace COMMAND

Manage namespaces

Commands:
  create      Create a namespace
  prune       Remove all unused namespaces
  rm          Remove one or more namespaces

Run 'nanocl namespace COMMAND --help' for more information on a command.
`)
};

function print_create_help() {
  stdout.write(`
Usage:  nanocl namespace create [OPTIONS] NETWORK

Create a network

Options:
      --name                 Name of the namespace

exemple: nanocl namespace create mynamespace or --name mynamespace

`);
}

const commands: Commands = {
  create: async (...args: string[]) => {
    if (!args.length) {
      print_create_help();
      exit(1);
    }
    console.log('before');
    const {args_values, args_new} = await args_parser(args, [
      {
        name: 'help',
        flags: ['--help', 'help', '-h'],
      },
      {
        name: 'name',
        flags: ['--name'],
        values: ['string'],
      }
    ])
    .catch((err) => {
      stdout.write(`${err.message}\n`);
      stdout.write(`see nanocl namespace create --help\n`);
      exit(1);
    });
    console.log(args_values);
    if (args_values.help) {
      print_create_help();
      exit(0);
    }
    if (args_new.length !== 1) {
      stdout.write(`nanocl namespace create \`${args.join(' ')}\` is not valid\n`);
      stdout.write('see \`nanocl namespace create --help\`\n')
      process.exit(1);
    }
    const name = args_values.name || args_new[0];
    console.log(name);
    await daemon_api.namespaces.create({
      name
    }).catch((err) => {
      console.error(err);
    });
    console.log('done');
    // daemon_api
    // const res = await client.post<any>('/networks', {
    //   name: args_new[0],
    // }).catch((err) => {
    //   if (err.errno === -2) {
    //     stdout.write('unable to connect to daemon\n');
    //     stdout.write('try nanocl daemon\n');
    //   }
    //   stdout.write(`Error response from daemon: ${err.data.message}\n`);
    //   exit(1);
    // });
    // stdout.write(JSON.stringify(res.data, null, 2));
  }
}

export default async function namespace(...argv: string[]) {
  if (!argv.length) {
    print_help();
    exit(1);
  }
  const command = commands[argv[0]];
  if (!command) {
    stdout.write(`nanocl \`${argv[2]}\` is not a command\n`);
    stdout.write('see \`nanocl network --help\`\n');
    process.exit(1);
  }
  command(...[...argv].slice(1));
}
