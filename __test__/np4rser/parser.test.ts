import path from 'path';
 
import {import_njs} from '../../src/np4rser/parser';

describe('[PARSER_NJS]', () => {
  it('invoke import_njs expect be abble to read test file', async () => {
    await import_njs(path.join(__dirname, './test_file.njs'));
  });
});
