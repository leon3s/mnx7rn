import { stdout } from 'process';
import daemon from '../../daemon';

export default async function daemon_start(host: string, port?: number) {
  let h_daemon = host || 'unix://./test.socket';
  daemon.listen(h_daemon, +(port || 0) || undefined);
  let d_listen = h_daemon;
  if (port) {
    d_listen = `http://${h_daemon}:${port}`;
  }
  stdout.write(
    `[${process.pid}] ` +
    `daemon listening on ` +
    d_listen + '\n'
  );
}
