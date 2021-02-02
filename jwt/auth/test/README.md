# Mocha Test Cases
Sample behavior driven development (BDD) test cases written using [Mocha](https://mochajs.org) and [Chai Assertion Library](https://www.chaijs.com) for the [auth](../auth/auth-redis.js) services.

## Steps
1. Create a Docker bridge network (`jwt_nodeapp-network`) for the containers.
```
docker network create jwt_nodeapp-network
```
2. Run `redis`
```
docker run --rm --network jwt_nodeapp-network --name redis --hostname redis redis
```
3. Build and run the [`auth` docker image](../Dockerfile)
```
cd ..
docker build . -t jwt_auth
docker run --rm --network jwt_nodeapp-network --hostname auth --init jwt_auth
```
4. Run the Mocha test script
```
docker run --rm -it -v $(pwd):/usr/src/app -w /usr/src/app --network=jwt_nodeapp-network --name node --init raymondwcs/node ./node_modules/mocha/bin/mocha server.js
```
