#mongoimport --uri 'mongodb://root:password@mongo:27017/test?authMechanism=DEFAULT&authSource=admin' --collection books --file books.json --jsonArray
mongoimport --host mongo:27017 --authenticationDatabase admin --username root --password password --collection books --jsonArray --file '/usr/src/app/books.json' 