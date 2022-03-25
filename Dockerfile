from ubuntu:impish

USER root

WORKDIR /root

RUN apt-get update -y

COPY ./install /root/install

RUN sh /root/install/ubuntu-2x.sh

RUN npm install -g npm@latest

RUN apt-get install sudo -y

RUN useradd -m nanocld

RUN usermod -aG docker nanocld

WORKDIR /home/nanocld

RUN chown nanocld:nanocld -R /home/nanocld

COPY --chown=nanocld ./package.json ./tsconfig.json ./image-entry.sh ./

RUN npm install

COPY --chown=nanocld ./src/ ./src/

RUN npm run build

RUN chown nanocld:nanocld /home/nanocld

ENTRYPOINT [ "bash", "image-entry.sh" ]
