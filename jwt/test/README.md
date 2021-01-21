# Mocha Test Cases
Sample behavior driven development (BDD) test cases written using [Mocha](https://mochajs.org) and [Chai Assertion Library](https://www.chaijs.com) for the `books` APIs.

## Preparation

Start all microservices using the instructions in [README.md](../README.md)

## Steps

1. Start a container for Node.js that connects to the same network of the microservices 
```
docker run -it --name node -v $(pwd):/code -w /code --network jwt_nodeapp-network node:alpine bash
```
2. Install dependencies 
```
npm install
```
3. Run [server.js](server.js)
```
./node_modules/mocha/bin/mocha server.js
```
