FROM node:alpine
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app/
COPY auth-redis.js /usr/src/app/
RUN npm install
EXPOSE 3000
ENTRYPOINT ["node", "auth-redis.js"]