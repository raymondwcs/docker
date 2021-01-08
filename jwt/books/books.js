
const express = require('express');
const bodyParser = require('body-parser');

const jwt = require('jsonwebtoken');
const app = express();

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

const books = [
    {
        "author": "Chinua Achebe",
        "country": "Nigeria",
        "language": "English",
        "pages": 209,
        "title": "Things Fall Apart",
        "year": 1958
    },
    {
        "author": "Hans Christian Andersen",
        "country": "Denmark",
        "language": "Danish",
        "pages": 784,
        "title": "Fairy tales",
        "year": 1836
    },
    {
        "author": "Dante Alighieri",
        "country": "Italy",
        "language": "Italian",
        "pages": 928,
        "title": "The Divine Comedy",
        "year": 1315
    },
]

app.get('/books', authenticateJWT, (req, res) => {
    console.log(`${req.method}, ${req.path}: ${JSON.stringify(req.query)}`)
    res.status(200).json(books);
});

app.post('/books', authenticateJWT, (req, res) => {
    console.log(`${req.method}, ${req.path}: ${JSON.stringify(req.body)}`)

    const { role } = req.user;

    if (role !== 'admin') {
        return res.sendStatus(403);
    }

    const book = req.body;
    books.push(book);

    res.send('book added successfully');
});

const port = process.env.PORT || 4000
app.listen(4000, () => {
    console.log(`Books service started on port ${port}`);
});
