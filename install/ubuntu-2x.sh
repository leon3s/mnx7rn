#!/bin/env sh

# Install docker (https://docs.docker.com/engine/install/ubuntu/)
apt-get remove -y docker docker.io containerd runc
apt-get update -y
apt-get install -y \
    ca-certificates \
    curl \
    gnupg \
    lsb-release
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
apt-get update -y
apt-get install -y docker-ce docker-ce-cli containerd.io
apt-get install -y qemu qemu-kvm

curl https://nodejs.org/dist/v16.14.2/node-v16.14.2-linux-x64.tar.xz _node.tar -s -o ./_node.tar > /dev/null
tar -xf _node.tar
cd ./node-v16.14.2-linux-x64/
cp -r ./lib ./include ./share ./bin /usr
cd ..
rm -r ./node-v16.14.2-linux-x64/
rm _node.tar
