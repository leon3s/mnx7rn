import path from 'path';
 
import { import_vcjs } from '../../../src/lib/vcjs';

describe('[PARSER_NJS]', () => {
  it('invoke import_vcjs expect be abble to read test file', async () => {
    await import_vcjs(path.join(__dirname, './test_file.vcjs'));
  });
});
