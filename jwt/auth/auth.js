const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();

const accessTokenSecret = 'somerandomaccesstoken';
const refreshTokenSecret = 'somerandomstringforrefreshtoken';

const users = [
    {
        username: 'john',
        password: 'password123',
        role: 'admin'
    }, {
        username: 'anna',
        password: 'password123',
        role: 'member'
    }
]

var refreshTokens = [];

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());


app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}: ${JSON.stringify(req.body)}`)
    next()
})

app.post('/login', (req, res) => {
    // read username and password from request body
    const { username, password } = req.body;

    // filter user from the users array by username and password
    const user = users.find(u => { return u.username === username && u.password === password });

    if (user) {
        // generate an access token
        const accessToken = jwt.sign({ username: user.username, role: user.role }, accessTokenSecret, { expiresIn: 10 });
        const refreshToken = jwt.sign({ username: user.username, role: user.role }, refreshTokenSecret);

        refreshTokens.push(refreshToken);

        const userInfo = {}
        userInfo['username'] = user.username
        userInfo['userrole'] = user.role

        res.status(200).json({
            userInfo,
            accessToken,
            refreshToken
        });
    } else {
        res.send('Username or password incorrect');
    }
});

app.post('/token', (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.sendStatus(401);
    }

    if (!refreshTokens.includes(token)) {
        return res.sendStatus(403);
    }

    jwt.verify(token, refreshTokenSecret, (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }

        const accessToken = jwt.sign({ username: user.username, role: user.role }, accessTokenSecret, { expiresIn: 10 });

        res.json({
            accessToken
        });
    });
});

app.post('/logout', (req, res) => {
    const { token } = req.body;
    refreshTokens = refreshTokens.filter(t => t !== token);

    res.json({ message: "Logout successful" });
});

const port = process.env.PORT || 3000
app.listen(3000, () => {
    console.log(`Authentication service started on port ${port}`);
});
