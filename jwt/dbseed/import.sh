mongoimport --host mongo:27017 --authenticationDatabase admin --username root --password password --collection books --jsonArray --file '/usr/src/app/books.json' 