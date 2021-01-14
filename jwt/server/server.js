const express = require('express');
const session = require('express-session')
const app = express();
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use(session({
    secret: ['veryimportantsecret','notsoimportantsecret','highlyprobablysecret'],  
    name: "secretname",
    cookie: {
        httpOnly: true,
        maxAge: 600000 // Time is in miliseconds
    },
    resave: true,
    saveUninitialized: false
}))

app.use((req,res,next) => {
    if (req.method === 'POST') {
        console.log(`${req.method}, ${req.path}: ${JSON.stringify(req.body)}`)
    } else {
        console.log(`${req.method}, ${req.path}: ${JSON.stringify(req.query)}`)
    }
    next()
})

app.set('view engine', 'ejs');

app.get('/', (req,res) => {
    /*
    var userInfo = {}
    if (req.session.userInfo) {
        userInfo = req.session.userInfo
    }
    */
    const userInfo = (req.session.userInfo) ? req.session.userInfo : {}

    if (req.session.accessToken && req.session.refreshToken) {
        fetch('http://books:4000/books', {
            method: "GET",
            headers: {"authorization": `Bearer: ${req.session.accessToken}`}
        })
        .then(response => {
            console.log(`response: ${response.status}, ${response.ok}`)
            switch(response.status) {
                case 403:
                    return res.redirect('/token')
                    break;
                case 200:
                    return(response.json()) // goto next .then()                   
                    break;
                default:
                    return res.status(500).end(`GET http://books:4000/books Error ${response.status}`)
            }
        })
        .then((json) => {
            if (json) {
                console.log(`books: ${JSON.stringify(json)}`)
                res.render('books', {books: json, userInfo: userInfo})
            }
        })
        .catch(err => console.log(err))
    }
    else {
        res.status(200).render('login')
    }
})

app.get('/create', (req,res) => {
    var userInfo = {}
    if (req.session.userInfo) {
        userInfo = req.session.userInfo
    }
    if (req.session.accessToken && req.session.refreshToken) {
        res.status(200).render('create')
    }
    else {
        res.status(200).render('login')
    }
})

app.post('/create', (req,res) => {
    if (req.session.accessToken && req.session.refreshToken) {
        fetch('http://books:4000/books', {
            method: "POST",
            headers: {
                "authorization": `Bearer: ${req.session.accessToken}`,
                "Content-type": "application/json; charset=UTF-8"
            },
            body: JSON.stringify(req.body)
        })
        .then(response => {
            switch(response.status) {
                case 200:
                    return res.status(200).redirect('/')
                    break;
                case 403:
                    /*
                    save form data for retry
                    */
                    req.session.savedFormData = req.body
                    /*
                    */
                    return res.redirect('/token')
                    break;
                default:
                    return res.status(500).end(`POST http://books:4000/books Error ${response.status}`)
            }
            /*
            if (response.status != 200) {
                return res.redirect('/token')
                // throw `Fetch cancelled: ${response.status}`
            } else {
                //return res.status(200).end('Create was successful')
                return res.redirect('/')
            }
            */
        })
        .catch(err => console.log(err))
    }
    else {
        res.status(200).render('login')
    }    
})

app.post('/login', (req,res) => {
    fetch('http://auth:3000/login', {
        method: "POST",
        body: JSON.stringify(req.body),
        headers: {"Content-type": "application/json; charset=UTF-8"}
    })
    .then(response => response.json())
    .then(json => {
        console.log(json)
        req.session.accessToken = json.accessToken
        req.session.refreshToken = json.refreshToken
        req.session.userInfo = json.userInfo
        res.redirect('/')
    })
    .catch(err => {
        console.log(err)
    })
})

app.get('/token', (req,res) => {
    const origin = req.get('origin');
    console.log(`Origin: ${origin}`)

    const referer = req.get('referer')
    console.log(`Referer: ${referer}`)

    const body = {}
    body['token'] = req.session.refreshToken
    fetch('http://auth:3000/token', {
        method: "POST",
        headers: {"Content-type": "application/json; charset=UTF-8"},
        body: JSON.stringify(body)
    })
    .then(response => response.json())
    .then(json => {
        req.session.accessToken = json.accessToken
        console.log(req.session.accessToken)
        if (referer.includes('/create') && req.session.savedFormData) {
            /*
            restore saved form data, retry create
            */
            // res.redirect('/create')
            const body = req.session.savedFormData
            req.session.savedFormData = null
            console.log(`Retry POST http://books:4000/books ${body}`)
            fetch('http://books:4000/books', {
                method: "POST",
                headers: {
                    "authorization": `Bearer: ${req.session.accessToken}`,
                    "Content-type": "application/json; charset=UTF-8"
                },
                body: JSON.stringify(body)
            })
            .then(response => {
                switch(response.status) {
                    case 200:
                        return res.status(200).redirect('/')
                        break;
                    default:
                        return res.status(500).end(`POST http://books:4000/books Error ${response.status}`)
                }
            })
            .catch(err => console.log(err))
            /*
            */
        } else {
            res.redirect('/')
        }
    })
    .catch(err => {
        console.log(err)
    })  
})

app.get('/logout', (req,res) => {
    const body = {}
    body['token'] = req.session.refreshToken

    req.session.accessToken = null
    req.session.refreshToken = null
    req.session.userInfo = null

    fetch('http://auth:3000/logout', {
        method: "POST",
        headers: {"Content-type": "application/json; charset=UTF-8"},
        body: JSON.stringify(body)
    })
    .then(response => {
        console.log(`${req.path}: ${response.status}`)
        return res.redirect('/')
    })
    .catch(err => {
        console.log(err)
    })  
})

const port = process.env.PORT || 8099
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
