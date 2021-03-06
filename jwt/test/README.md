# Mocha Test Cases
Sample behavior driven development (BDD) test cases written using [Mocha](https://mochajs.org) and [Chai Assertion Library](https://www.chaijs.com) for the [books](../books/books_mongodb.js) APIs.

## Preparation

Start all microservices (see [README.md](../README.md) for details)

## Steps

1. Containerize the Mocha test scripts
```
docker build . -t jwt_test
```
2. Run container on the same network of the microservices 
```
docker run --rm --network jwt_nodeapp-network jwt_test
```