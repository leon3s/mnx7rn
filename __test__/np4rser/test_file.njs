host(class MainHost {
  host_name = 'nanocld.main';
  socket_path = './test.sock';
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
