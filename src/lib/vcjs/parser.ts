import fs from 'fs';
import vm from 'vm';
import path from 'path';

export class Host {
  host_ip: string = '';
  host_name: string = '';
  socket_path: string = './test-socket.sock';
  constructor() {};
}

export class Network {
  host: string = '';
  host_name: string = '';
  is_existing: boolean = false;
  constructor() {};
}

class FileContext {
  name: string;
  path: string;
  content: string;
  hosts: Host[] = [];
  networks: Network[] = [];
  ctx_vm: Record<string, any> = {};

  constructor(
    p_file: string,
    c_file: string,
  ) {
    this.path = p_file;
    this.name = path.basename(p_file);
    this.content = c_file;
    this.ctx_vm = {
      host: this.host,
      ntwk: this.ntwk,
    }
    vm.createContext(this.ctx_vm);
  };

  host = (H: typeof Host) => {
    const h = new H();
    this.hosts.push(h);
  }

  ntwk = (N: typeof Network) => {
    const n = new N();
    try {
      verify_network(n);
      this.networks.push(n);
    } catch (e: any) {
      throw new Error(`Error in file ${this.name} network ${n.constructor.name} ${e.message}`);
    }
  }
}

function verify_network(n: Network) {
  if (!n.host?.length) {
    throw new Error(`require host`);
  }
  if (!n.host_name?.length) {
    throw new Error(`require host_name`);
  }
}

function read_njs_file(p_file: string): string {
  const extname = path.extname(p_file);
  if (extname !== '.vcjs') {
    throw new Error('Can only read .njs file.');
  }
  return fs.readFileSync(p_file, 'utf-8');
}

function create_njs_file_ctx(p_file: string, c_file: string): FileContext {
  const ctx = new FileContext(p_file, c_file);
  return ctx;
}

function exec_njs_file(ctx_file: FileContext) {
  const s_file = new vm.Script(ctx_file.content);
  s_file.runInContext(ctx_file.ctx_vm);
}

export async function import_vcjs(p_file: string) {
  const c_file = read_njs_file(p_file);
  const ctx_file = create_njs_file_ctx(p_file, c_file);
  exec_njs_file(ctx_file);
  return ctx_file;
}
