// test/server.js
// docker run -d -it --name node -v $(pwd):/code -w /code --network jwt_nodeapp-network arm64v8/node bash

//const request = require("request");
const expect = require("chai").expect;
const fetch = require('node-fetch');
const assert = require('assert');

describe("Books API", function () {

    describe("Get books", function () {

        const authUrl = "http://auth:3000/login";
        const booksUrl = "http://books:4000/books";
        const body = { "username": "john", "password": "password123" }
        var accessToken = "";

        it("returns jwt", async () => {
            let res = await fetch('http://auth:3000/login', {
                method: "POST",
                body: JSON.stringify(body),
                headers: { "Content-type": "application/json; charset=UTF-8" }
            })
            let response = await res.json()
            expect(response).to.have.property('accessToken')
            expect(response).to.have.property('refreshToken')
            expect(response).to.have.property('userInfo')
            accessToken = response.accessToken
            console.log(accessToken)
        });

        it("returns 3 books", async () => {
            let res = await fetch('http://books:4000/books', {
                method: "GET",
                headers: { "authorization": `Bearer: ${accessToken}` }
            })
            let response = await res.json()
            //assert.equal(Object.keys(response).length, 3)
            expect(response).to.have.lengthOf(3)
        });
    });
});
