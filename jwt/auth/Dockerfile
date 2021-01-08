FROM node:current-alpine
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app/
COPY auth.js /usr/src/app/
RUN npm install
EXPOSE 3000
ENTRYPOINT ["node", "auth.js"]