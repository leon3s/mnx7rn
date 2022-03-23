import { stdout } from 'process';
import deamon from '../../deamon';

export default async function deamon_start(host: string, port?: number) {
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
