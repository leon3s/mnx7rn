from ubuntu:impish

USER root

WORKDIR /root

RUN apt-get update -y

COPY ./install /root/install

RUN sh /root/install/ubuntu-2x.sh

RUN npm install -g npm@latest

RUN useradd -m nanocld

USER nanocld

RUN mkdir -p /home/nanocld

WORKDIR /home/nanocld

COPY --chown=nanocld ./package.json ./tsconfig.json ./

RUN npm install

COPY --chown=nanocld ./src/ ./src/

RUN npm run build

CMD ["npm", "start", "daemon", "0.0.0.0", "1337"];
