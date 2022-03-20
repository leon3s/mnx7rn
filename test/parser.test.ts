import path from 'path';
import {read_nxtc} from '../src/nxtc_parser';

const exp_networks = [
  {
    name: "development",
    host: "127.0.0.1",
    host_name: "dev.local",
    containers: [],
  },
  {  
    name: "production",
    host: "128.0.0.1",
    host_name: "test.nxtra.net",
    containers: [{
      name: "test-nginx-container",
      host: "128.0.0.10",
      host_name: "test-nginx-container.com",
      image_name: "nginx",
    }]
  }
];

describe('Parser', () => {
  it('it should read and parse correctly the test file', () => {
    const {networks} = read_nxtc(path.join(__dirname, './test.nxtc'));
    console.log(networks);
    expect(networks).toStrictEqual(exp_networks);
  });
});
