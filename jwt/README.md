# Docker Compose
[Docker Compose](https://docs.docker.com/compose/) is a tool for defining and running multi-container Docker applications. With Compose, you use a `YAML` file to configure your application’s services. Then, with a single command, you create and start all the services from your configuration.

This tutorial demonstrates deployment of microservices using Docker Compose.  Five services are defined in [docker-compose.yml](docker-compose.yml)
1. [auth](auth/) - Serivices for creating and validaing [Java Web Tokens (JWT)](https://jwt.io)
1. [books](books/) - RESTful services for documents stored in `books` collection
1. mongo - MongoDB 4.x server manages the `books` collection
1. [dbseed](dbseed/) - Populate the `books` colleciton with a few sample documents
1. [server](server/) - An Express 4.x server serving end-user requests at port `8099`

## Preparation
[Install docker-compose](https://docs.docker.com/compose/install/)

## Steps
1. Run the following command to build and run containers (`jwt_auth`, `jwt_books`, `jwt_dbseed`, `jwt_server` and `mongo`) for each of the five services.
```
docker-compose up -d
```
2. Run the app by opening `localhost:8099` in your web browser.
3. Shutdown the containers when you're done.
```
docker-compose down
```