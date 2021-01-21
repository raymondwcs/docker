
const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
const jwt = require('jsonwebtoken');
const assert = require('assert');
const app = express();

const mongourl = 'mongodb://root:password@mongo:27017/test?authMechanism=DEFAULT&authSource=admin'
const dbName = 'test';
const accessTokenSecret = 'somerandomaccesstoken';

app.use(bodyParser.json());

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, accessTokenSecret, (err, user) => {
            if (err) {
                console.log(JSON.stringify(err))
                return res.sendStatus(403);
            }

            req.user = user;
            next();
        });
    } else {
        console.error(`Invalid authHeader!`)
        res.sendStatus(401);
    }
}

const findDocument = (db, criteria, callback) => {
    console.log(`findDocument: ${criteria}`);
    var findCriteria = {}
    if (criteria._id) {
        findCriteria['_id'] = new ObjectId(criteria._id)
    } else {
        findCriteria = criteria
    }
    var cursor = db.collection('books').find(findCriteria);
    cursor.toArray((err, docs) => {
        assert.equal(err, null);
        console.log(`findDocument: ${docs.length}`);
        callback(docs);
    });
}

const handle_Find = (req, res, criteria) => {
    const client = new MongoClient(mongourl);
    client.connect((err) => {
        assert.equal(null, err);
        console.log("Connected successfully to server");
        const db = client.db(dbName);

        findDocument(db, criteria, (docs) => {
            client.close();
            console.log("Closed DB connection");
            res.status(200).json(docs);
        });
    });
}

app.get('/books', authenticateJWT, (req, res) => {
    console.log(`${req.method}, ${req.path}: ${JSON.stringify(req.query)}`)
    const criteria = (req.query) ? req.query : {}
    handle_Find(req, res, criteria)
});

app.post('/books', authenticateJWT, (req, res) => {
    console.log(`${req.method}, ${req.path}: ${JSON.stringify(req.body)}`)

    const { role } = req.user;

    if (role !== 'admin') {
        return res.sendStatus(403);
    }

    const client = new MongoClient(mongourl);
    client.connect((err) => {
        assert.equal(null, err);
        console.log("Connected successfully to server");
        const db = client.db(dbName);
        let newDoc = req.body
        db.collection('books').insertOne(newDoc, (err, results) => {
            assert.equal(err, null);
            client.close()
            console.log(`POST /books: ${JSON.stringify(results)}`)
            if (results.insertedCount == 1) {
                res.status(200).json({ "insertedID": `${results.insertedId}` })
            } else {
                res.sendStatus(500)
            }
        })
    })
});

const port = process.env.PORT || 4000
app.listen(4000, () => {
    console.log(`Books service started on port ${port}`);
});
