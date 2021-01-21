// test/server.js
// docker run -d -it --name node -v $(pwd):/code -w /code --network jwt_nodeapp-network arm64v8/node bash

const expect = require("chai").expect
const fetch = require('node-fetch')

const authLoginUrl = "http://auth:3000/login"
const authLogoutUrl = "http://auth:3000/logout"
const booksUrl = "http://books:4000/books"
/*
describe("Books API - Read", function () {

    describe("Get books", function () {

        var accessToken = "";
        var refreshToken = "";

        it("returns jwt", async () => {
            var body = { "username": "john", "password": "password123" }

            let res = await fetch(authLoginUrl, {
                method: "POST",
                body: JSON.stringify(body),
                headers: { "Content-type": "application/json; charset=UTF-8" }
            })
            let response = await res.json()
            expect(response).to.have.property('accessToken')
            expect(response).to.have.property('refreshToken')
            expect(response).to.have.property('userInfo')
            accessToken = response.accessToken
            refreshToken = response.refreshToken
        });

        it("returns 3 books", async () => {
            let res = await fetch(booksUrl, {
                method: "GET",
                headers: { "authorization": `Bearer: ${accessToken}` }
            })
            let response = await res.json()
            //assert.equal(Object.keys(response).length, 3)
            expect(response).to.have.lengthOf(3)
        });

        it("logout", async () => {
            var body = {}
            body['token'] = refreshToken

            let res = await fetch(authLogoutUrl, {
                method: "POST",
                body: JSON.stringify(body),
                headers: { "Content-type": "application/json; charset=UTF-8" }
            })
            let response = await res.json()
        });
    });
});
*/
describe("Books API - Create", function () {

    describe("Create book", function () {

        var accessToken = ''
        var refreshToken = ''
        var newBookId = ''

        it("returns jwt", async () => {
            var body = { "username": "john", "password": "password123" }

            let res = await fetch(authLoginUrl, {
                method: "POST",
                body: JSON.stringify(body),
                headers: { "Content-type": "application/json; charset=UTF-8" }
            })
            expect(res.status).to.equal(200)
            let response = await res.json()
            expect(response).to.have.property('accessToken')
            expect(response).to.have.property('refreshToken')
            expect(response).to.have.property('userInfo')
            accessToken = response.accessToken
            refreshToken = response.refreshToken
        });

        const newBookTitle = 'testing'
        const newBookAuthor = 'johndole'
        it("creates a new book", async () => {
            var body = {}
            body['title'] = newBookTitle
            body['author'] = newBookAuthor

            let res = await fetch(booksUrl, {
                method: "POST",
                body: JSON.stringify(body),
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                    "authorization": `Bearer: ${accessToken}`
                }
            })
            expect(res.status).to.equal(200)
            let response = await res.json()
            expect(response).to.have.property('insertedID')
            newBookId = response.insertedID
            //console.log(newBookId)
        });

        it("reads the new book", async () => {
            //let res = await fetch(`${booksUrl}?title=${newBookTitle}&author=${newBookAuthor}`, {
            let res = await fetch(`${booksUrl}?_id=${newBookId}`, {
                method: "GET",
                headers: { "authorization": `Bearer: ${accessToken}` }
            })
            expect(res.status).to.equal(200)
            let response = await res.json()
            //console.log(response[0])
            expect(response).to.have.lengthOf(1)
        });

        it("logout", async () => {
            var body = {}
            body['token'] = refreshToken

            let res = await fetch(authLogoutUrl, {
                method: "POST",
                body: JSON.stringify(body),
                headers: { "Content-type": "application/json; charset=UTF-8" }
            })
            let response = await res.json()
        });
    });
});
