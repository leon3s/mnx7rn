import { exit, stdin, stdout } from 'process';

const KEY_ENTER = 0x0d;
const KEY_DELETE = 0x7f;
const KEY_CTRL_C = 0x03;

export default async function login() {
  stdout.write('name > ');
  stdin.setRawMode(true);
  let user_input = Buffer.from([]);
  stdin.on("data", (buffer) => {
    const [key] = buffer;
    if (key === KEY_ENTER) {
      
    }
    // if (key === KEY_DELETE) {

    // }
    if (key === KEY_CTRL_C) {
      exit(0);
    }
    user_input = Buffer.concat([user_input, buffer]);
    stdout.write(buffer);
  });
}
