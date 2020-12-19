# Docker Compose
[Docker Compose](https://docs.docker.com/compose/) is a tool for defining and running multi-container Docker applications. With Compose, you use a `YAML` file to configure your application’s services. Then, with a single command, you create and start all the services from your configuration.

This tutorial demonstates how to deploy a server-side app using two containers.  One container runs a complete express.js app.  The other container runs a MongoDB server.

## Preparation
1. [Install docker-compose](https://docs.docker.com/compose/install/)
1. Replace the values of `facebookAuth.clientID` and `facebookAuth.clientSecret` in[server.js](server.js) with a valid [Facebook App ID and App Secret](https://github.com/raymondwcs/oauth).

## Steps
1. Build and start docker container images.
```
docker-compose up -d
```
2. Goto `localhost:8099` in your web browser
3. Shutdown the containers when you're done.
```
docker-compose down
```