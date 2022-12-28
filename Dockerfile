FROM node:18-bullseye
 WORKDIR /app
COPY package*.json .
RUN apt-get update && apt-get install -y build-essential
RUN apt-get install -y cmake g++ gcc libuv1-dev libopus-dev protobuf-compiler libtool
RUN apt-get install -y libavcodec-dev libavcodec58 libavformat-dev libavformat58 libavutil-dev libavutil56 libavfilter7 libavfilter-dev libswresample-dev libswresample3
RUN apt-get install -y git
RUN apt-get install -y ninja-build
# RUN npm i --global protobuf-compiler
RUN apt-get install -y libsodium-dev libtool
RUN npm install -g npm@9.2.0
# RUN apt-get update && apt-get install -y vim
# RUN npm install --global yarn
# RUN apt-get install -y autoconf automake build-base libtool nasm
COPY . .
RUN npm install
# ci --only=production
RUN npm install -g typescript
RUN apt install -y pkg-config libssl-dev libmp3lame-dev libopus-dev libvorbis-dev nasm

RUN git clone --depth 1 https://github.com/FFmpeg/FFmpeg
# RUN chmod +x /app/FFmpeg
# RUN chmod +x /app/FFmpeg/configure
# RUN apt-get install sudo
# RUN cd /app/FFmpeg
# RUN apt-get install tar wget
# RUN wget https://www.ffmpeg.org/releases/ffmpeg-snapshot.tar.bz2
# RUN tar jxvf ffmpeg-snapshot.tar.bz2
WORKDIR /app/FFmpeg
RUN apt-get install sudo
RUN sudo ./configure --arch=amd64 --disable-stripping --enable-openssl --enable-libmp3lame --enable-libopus --enable-libvorbis --enable-shared --enable-nonfree
RUN sudo make -j $(nproc)
RUN sudo make install
RUN sudo ldconfig
EXPOSE 80
