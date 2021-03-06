# Docker Compose
[Docker Compose](https://docs.docker.com/compose/) is a tool for defining and running multi-container Docker applications. With Compose, you use a `YAML` file to configure your application’s services. Then, with a single command, you create and start all the services from your configuration.

This tutorial demonstrates deployment of microservices using Docker Compose.  Seven services are defined in [docker-compose.yml](docker-compose.yml)
1. [auth](auth/) - Serivices for creating and validaing [Java Web Tokens (JWT)](https://jwt.io)
1. redis - Redis server for `auth` storing user accounts and tokens
1. [redisseed](redisseed/) - Create a few user accounts
1. [books](books/) - Services for managing documents in the `books` collection
1. mongo - MongoDB 4.x server hosting the `books` collection
1. [dbseed](dbseed/) - Create a few sample documents in the `books` colleciton
1. [server](server/) - An Express 4.x server serving end-user requests at port `8099`

## Preparation
[Install docker-compose](https://docs.docker.com/compose/install/)

## Steps
1. Run the following command to build and run containers (`jwt_auth`, `jwt_books`, `jwt_dbseed`, `jwt_server`, `redis` and `mongo`) for each of the five services.
```
docker-compose up -d
```
2. Check service status
```
docker-compose ps
```
3. Run the app by opening `localhost:8099` in your web browser.
4. Shutdown the containers when you're done.
```
docker-compose down
```
