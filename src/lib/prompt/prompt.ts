import {
  exit,
  stdin,
  stdout,
} from 'process';

const KEY_ENTER = 0x0d;
const KEY_CTRL_C = 0x03;
const KEY_BACKSPACE = 0x7f;
const KEY_DELETE = Buffer.from([0x1b, 0x5b, 0x33, 0x7e]);
const KEY_ARROW_TOP = Buffer.from([0x1b, 0x5b, 0x41]);
const KEY_ARROW_BOT = Buffer.from([0x1b, 0x5b, 0x42]);
const KEY_ARROW_LEFT = Buffer.from([0x1b, 0x5b, 0x44]);
const KEY_ARROW_RIGHT = Buffer.from([0x1b, 0x5b, 0x43]);

export type PromptOpts = {
  is_hidden?: boolean;
}

export function prompt(
  text: string,
  opts: PromptOpts = { is_hidden: false },
): Promise<Buffer> {
  const { is_hidden } = opts;
  return new Promise<Buffer>((resolve) => {
    let line_length = text.length;
    let user_input = Buffer.from([]);

    stdin.ref();
    stdout.write(text);
    stdin.setRawMode(true);

    function stdin_on_data(buffer: Buffer) {
      const [key] = buffer;
      if (!buffer.compare(KEY_ARROW_TOP)) {
        return;
      }
      if (!buffer.compare(KEY_ARROW_BOT)) {
        return;
      }
      if (!buffer.compare(KEY_ARROW_LEFT)) {
        return;
      }
      if (!buffer.compare(KEY_ARROW_RIGHT)) {
        return;
      }
      if (!buffer.compare(KEY_DELETE)) {
        return;
      }
      if (key === KEY_BACKSPACE) {
        if (user_input.length) {
          user_input = user_input.slice(0, -1);
          line_length -= 1;
          if (is_hidden) return;
          stdout.cursorTo(line_length);
          stdout.write(' ');
          if (line_length < text.length)
            line_length = text.length;
          stdout.cursorTo(line_length);
        }
        return;
      }
      if (key === KEY_CTRL_C) {
        stdout.clearScreenDown();
        stdout.write('\n');
        exit(0);
      }
      if (key === KEY_ENTER) {
        stdout.write("\n");
        stdin.unref();
        stdin.setRawMode(false);
        stdin.off("data", stdin_on_data);
        resolve(user_input);
        return;
      }
      user_input = Buffer.concat([user_input, buffer]);
      line_length += 1;
      if (is_hidden) return;
      stdout.write(buffer);
    }

    stdin.on("data", stdin_on_data);
  });
}
