# redis-cli() {
#   docker run --rm -it -v $(pwd):/usr/src/app -w /usr/src/app --name redis-cli --network=host arm64v8/redis:6-alpine redis-cli $*
# }
redis-cli -h redis hset john password "password123" role "admin"
redis-cli -h redis hset anna password "password123" role "member"
