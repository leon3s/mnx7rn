ntwk_ex(class Dev {
  host = '127.0.0.1'
  host_name = 'dev.local';
});

ntwk_ex(class Docker {
  host = '172.17.0.1';
  host_name = 'docker.local';
});

ntwk(class Test {
  host = '128.0.0.1';
  host_name = 'test.local';

  containers = [
    {
      host: '128.0.0.10',
      ports: {
        '1222/tcp': '80/tcp',
      },
      image_name: 'nginx',
    }
  ]
});
