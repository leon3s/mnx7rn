import path from 'path';

host(class Host {
  socket_path = path.join(__dirname, './nanocld.sock');
});
