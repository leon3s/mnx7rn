FROM ubuntu:impish

USER root

WORKDIR /root

ENV TZ=Europe/Paris
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN apt-get update -y

COPY ./install /root/install

RUN sh /root/install/ubuntu-2x.sh

RUN npm install -g npm@latest

RUN apt-get install sudo -y

RUN useradd -m nanocl

RUN usermod -aG docker nanocl

WORKDIR /home/nanocl

RUN chown nanocl:nanocl -R /home/nanocl

COPY --chown=nanocl ./package.json ./tsconfig.json ./image-entry.sh ./

RUN npm install

COPY --chown=nanocl ./src/ ./src/

RUN npm run build

RUN chown nanocl:nanocl /home/nanocl

ENTRYPOINT [ "bash", "image-entry.sh" ]
