import fs from 'fs';
import vm from 'vm';
import path from 'path';

class FileContext {
  name: string;
  path: string;
  content: string;
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
      ntwk_ex: this.ntwk_ex,
      ntwk: this.ntwk,
    }
    vm.createContext(this.ctx_vm);
  };

  ntwk = (N: typeof Network) => {
    const n = new N();
    try {
      verify_network(n);
      this.networks.push(n);
    } catch (e: any) {
      throw new Error(`Error in file ${this.name} network ${n.constructor.name} ${e.message}`);
    }
  }

  ntwk_ex = (N: typeof Network) => {
    const n = new N();
    try {
      n.is_existing = true;
      verify_network(n);
      this.networks.push(n);
    } catch (e: any) {
      throw new Error(`Error in file ${this.name} network ${n.constructor.name} ${e.message}`);
    }
  }
}

export class Network {
  host: string = '';
  host_name: string = '';
  is_existing: boolean = false;
  constructor() {};
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
  if (extname !== '.njs') {
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

export async function import_njs(p_file: string) {
  const c_file = read_njs_file(p_file);
  const ctx_file = create_njs_file_ctx(p_file, c_file);
  exec_njs_file(ctx_file);
  return ctx_file;
}
