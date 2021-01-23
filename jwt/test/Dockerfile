FROM node:alpine
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app/
COPY server.js /usr/src/app/
RUN npm install
ENTRYPOINT ["./node_modules/mocha/bin/mocha", "server.js"]