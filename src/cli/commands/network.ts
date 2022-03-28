import {
  exit,
  stdout,
} from 'process';
import { HttpClient } from '../../lib/HttpClient';

import args_parser from '../args_parser';

import type { Commands } from '../args_parser';
import daemon_api from '../daemon_api';

function print_help() {
  stdout.write(`
Usage:  nanocl network COMMAND

Manage networks

Commands:
  connect     Connect a container to a network
  create      Create a network
  disconnect  Disconnect a container from a network
  inspect     Display detailed information on one or more networks
  ls          List networks
  prune       Remove all unused networks
  rm          Remove one or more networks

Run 'nanocl network COMMAND --help' for more information on a command.
`)
};

function print_create_help() {
  stdout.write(`
Usage:  nanocl network create [OPTIONS] NETWORK

Create a network

Options:
      --attachable           Enable manual container attachment
      --aux-address map      Auxiliary IPv4 or IPv6 addresses used by Network driver (default map[])
      --config-from string   The network from which to copy the configuration
      --config-only          Create a configuration only network
  -d, --driver string        Driver to manage the Network (default "bridge")
      --gateway strings      IPv4 or IPv6 Gateway for the master subnet
      --ingress              Create swarm routing-mesh network
      --internal             Restrict external access to the network
      --ip-range strings     Allocate container ip from a sub-range
      --ipam-driver string   IP Address Management Driver (default "default")
      --ipam-opt map         Set IPAM driver specific options (default map[])
      --ipv6                 Enable IPv6 networking
      --label list           Set metadata on a network
  -o, --opt map              Set driver specific options (default map[])
      --scope string         Control the network's scope
      --subnet strings       Subnet in CIDR format that represents a network segment

exemple: nanocl network create super_network

`)
}

const commands: Commands = {
  create: async (...args: string[]) => {
    if (!args.length) {
      print_create_help();
      exit(1);
    }
    const {args_values, args_new} = await args_parser(args, [
      {
        name: 'help',
        flags: ['--help', 'help', '-h'],
      },
      {
        name: 'gateway',
        flags: ['--gateway'],
        values: ['string'],
      },
      {
        name: 'subnet',
        flags: ['--subnet'],
        values: ['string'],
      },
      {
        name: 'ip_range',
        flags: ['--ip-range'],
        values: ['string'],
      },
      {
        name: 'driver',
        flags: ['--driver'],
        values: ['string'],
      }
    ])
    .catch((err) => {
      stdout.write(`${err.message}\n`);
      stdout.write(`see nanocl network connect --help\n`);
      exit(1);
    });
    if (args_new.length !== 1) {
      stdout.write(`nanocl network create \`${args.join(' ')}\` is not valid\n`);
      stdout.write('see \`nanocl network create --help\`\n')
      process.exit(1);
    }
    if (args_values.help) {
      print_create_help();
      exit(0);
    }
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

export default async function network(...argv: string[]) {
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
