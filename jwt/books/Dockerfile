FROM node:current-alpine
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app/
COPY books*.js /usr/src/app/
RUN npm install
EXPOSE 4000
ENTRYPOINT ["node", "books.js"]