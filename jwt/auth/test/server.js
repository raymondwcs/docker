// test/server.js
// docker run -d -it --name node -v $(pwd):/code -w /code --network jwt_nodeapp-network arm64v8/node bash

const expect = require("chai").expect
const fetch = require('node-fetch')
const redis = require("redis");

// const authLoginUrl = "http://auth:3000/login"
// const authLogoutUrl = "http://auth:3000/logout"
const authLoginUrl = "http://127.0.0.1:3000/login"
const authLogoutUrl = "http://127.0.0.1:3000/logout"
const authRefreshTokentUrl = "http://127.0.0.1:3000/token"

describe("auth", function () {
    var accessToken = ''
    var refreshToken = ''

    before(() => {
        const client = redis.createClient();
        client.on("error", function (error) {
            console.error(error);
            return res.status(500);
        });
        client.hset('x', 'password', 'password123');
        client.hset('x', 'role', 'admin');
        client.quit()
    });

    after(() => {
        const client = redis.createClient();
        client.on("error", function (error) {
            console.error(error);
            return res.status(500);
        });
        client.del('x')
        client.quit()
    })

    it("returns jwt", function (done) {
        const body = { "username": "x", "password": "password123" }
        fetch(authLoginUrl, {
            method: "POST",
            body: JSON.stringify(body),
            headers: { "Content-type": "application/json; charset=UTF-8" }
        }).then((res) => {
            expect(res.status).to.equal(200)
            return res.json()
        }).then(response => {
            expect(response).to.have.property('accessToken')
            expect(response).to.have.property('refreshToken')
            expect(response).to.have.property('userInfo')
            accessToken = response.accessToken
            refreshToken = response.refreshToken
            done()
        })
    })

    it("refreshs token", async () => {
        const body = { "token": refreshToken }
        let res = await fetch(authRefreshTokentUrl, {
            method: "POST",
            body: JSON.stringify(body),
            headers: { "Content-type": "application/json; charset=UTF-8" }
        })
        expect(res.status).to.equal(200)
        let response = await res.json()
        expect(response).to.have.property('accessToken')
        accessToken = response.accessToken
    })

    it("logout", function (done) {
        let body = {}
        body['token'] = refreshToken

        fetch(authLogoutUrl, {
            method: "POST",
            body: JSON.stringify(body),
            headers: { "Content-type": "application/json; charset=UTF-8" }
        }).then((res) => {
            expect(res.status).to.equal(200)
            done()
        })
    });
    /*
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

    it("logout", async () => {
        var body = {}
        body['token'] = refreshToken

        let res = await fetch(authLogoutUrl, {
            method: "POST",
            body: JSON.stringify(body),
            headers: { "Content-type": "application/json; charset=UTF-8" }
        })
        expect(res.status).to.equal(200)
    });
    */
});
