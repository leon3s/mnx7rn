import {readFileSync} from 'fs';

interface nxtc_container {
  name: string;
  host: string;
  host_name: string;
  image_name: string;
}

interface nxtc_network {
  name: string;
  host: string;
  host_name: string;
  containers: nxtc_container[];
}

interface nxtc {
  networks: nxtc_network[];
}

/**
 * Block item
 */
interface parser_block {
  name: string;
  content: string;
  start: number;
  end: number;
  children: parser_block[];
}

/**
 * Create a new object parser_block
 * @param block partial block
 * @returns new block
 */
function new_block(block: Partial<parser_block>): parser_block {
  return {
    name: block.name || '',
    content: block.content || '',
    start: block.start || 0,
    end: block.start || 0,
    children: [],
  }
}

/**
 * read name of a block of { }
 * @param buffer file content
 * @param start start reading at
 * @returns name of the block
 */
function read_block_name(buffer: string, start: number) {
  let count = start;
  let name = '';
  let startCopy = false;
  while (count !== -1) {
    const char = buffer[count];
    if (char !== ' ') {
      startCopy = true;
    }
    if (startCopy) {
      if (char === '\n' || char === ' ') {
        return name;
      }
      name = `${char}${name}`;
    }
    count -= 1;
  }
  return name;
}

/**
 * Recursively read block of a config file
 * @param buffer file content
 * @param start start reading at
 * @returns return a new block with his childrens
 */
function read_block(buffer: string, start: number): parser_block {
  let count = start;
  let opennedBracket = 1;
  const name = read_block_name(buffer, start - 2);
  if (!name.length) {
    throw new Error(`Cound\'t find name for block starting at ${start}`);
  }
  const block = new_block({
    name,
    content: '{',
    start: start,
    end: start,
  });
  while (count < buffer.length) {
    const char = buffer[count];
    block.content += char;
    if (char === '{') {
      opennedBracket += 1;
      const new_block = read_block(buffer, count + 1);
      block.children.push(new_block);
      block.content += new_block.content
        .slice(0, -1)
          .substring(1);
      count = new_block.end - 1;
    }
    if (char === '}') {
      opennedBracket -= 1;
      if (!opennedBracket) {
        break;
      }
    }
    count += 1;
  }
  if (opennedBracket) {
    throw new Error(`Error missing bracket starting at line : ${block.start}`);
  }
  block.end = count;
  return block;
}

/**
 * Parse content of a .nxtc file and return his block
 * @param buffer file content
 * @returns block item of main context
 */
function read_blocks(buffer: string) {
  let count = - 1;
  const block = new_block({
    name: 'main',
    content: buffer,
    end: buffer.length,
  });
  while (++count < buffer.length) {
    const char = buffer[count];
    if (char === '{') {
      const new_block = read_block(buffer, count + 1);
      block.children.push(new_block);
      count = new_block.end - 1;
    }
  }
  return block;
}

function get_variable_value(content: string, start: number) {
  let value = '';
  let count = start - 1;
  while (++count < content.length) {
    const char = content[count];
    if (char === ' ') {
      continue;
    }
    if (char === '\n' && content[count - 1] !== ';') {
      throw new Error(`Missing semicolong at line ${count}`);
    }
    if (char === ';') break;
    value += char;
  }
  return value;
}

function get_variable(key: string, content: string) {
  const start = content.indexOf(key);
  if (start === -1) throw new Error(key);
  return get_variable_value(content, start + key.length);
}

function directive_container(block: parser_block): nxtc_container {
  const name = get_variable('name', block.content);
  const host = get_variable('host', block.content);
  const host_name = get_variable('host_name', block.content);
  const image_name = get_variable('image_name', block.content);
  return {
    name,
    host,
    host_name,
    image_name,
  };
}

function directive_network(block: parser_block, is_existing: boolean = false): nxtc_network {
  const name = get_variable('name', block.content);
  const host = get_variable('host', block.content);
  const host_name = get_variable('host_name', block.content);
  const containers = [];
  let count = -1;
  while (++count < block.children.length) {
    const child_block = block.children[count];
    if (child_block.name !== 'container') {
      throw new Error(`d${child_block.name}not supported at line  ${child_block.start}`);
    }
    const container = directive_container(child_block);
    containers.push(container);
  }
  return {
    name,
    host,
    host_name,
    containers,
  };
}

export function parse_nxtc(buffer: string): nxtc {
  let count = -1;
  const blocks = read_blocks(buffer);
  const networks: nxtc_network[] = [];
  while (++count < blocks.children.length) {
    const block = blocks.children[count];
    const network = directive_network(block);
    networks.push(network);
  }
  return {
    networks,
  }
}

/**
 * 
 * @param filepath path of the file
 * @returns 
 */
export function read_nxtc(filepath: string) {
  const buffer = readFileSync(filepath, 'utf-8');
  return parse_nxtc(buffer);
}
