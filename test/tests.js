const server = require('supertest').agent("http://localhost:8080");
const assert = require('chai').assert;

describe('server.js', function () {
    it('/ endpoint should render homepage', function (done) {
        server
            .get('/')
            .expect(200)
            .expect("Content-type", /html/)
            .end((err, res) => {
                assert.equal(res.status, 200);
                done();
            });
    });
    it('/register should give you a sessionID', function (done) {
        body = {};
        body.email = "ahmad123wqe"+String((Math.random()*100000)+1)+"1@nikko2.com";
        body.pwd = 'Asdf12345!@#';
        body.pwd2 = 'Asdf12345!@#';
        server
            .post('/register')
            .send(body)
            .expect(200)
            .end((err, res) => {
                console.log(res.header);
                assert.equal(res.status, 302);
                let sess = res.header["set-cookie"] !== undefined;
                assert.equal(sess, true);
                done();

            });
    });
    it("/logout should clear the cookie", (done) => {
        server
            .get('/logout')
            .expect(200)
            .end((err, res) => {
                assert.equal(res.status, 302);
                try{
                    let sess = res.headers["set-cookie"][0].includes('sid=;');
                    assert.equal(sess, true);
                }
                catch (e) {
                    let sess = res.headers["set-cookie"][0] === undefined;
                    assert.equal(sess, true);
                }
                done();
            });
    });
    it('/login should give you a sessionID', function (done) {
        body = {};
        body.email = "ahmad1@nikko.com";
        body.pwd = "Asdf12345";
        server
            .post('/login')
            .send(body)
            .expect(200)
            .end((err, res) => {
                assert.equal(res.status, 302);
                console.log(res.header);
                let sess = res.headers["set-cookie"] !== undefined;
                assert.equal(sess, true);
                done();
            });
    });

    it('/shop should have status 200', (done)=>{
        body = {};
        body.email = "ahmad1@nikko.com";
        body.pwd = "Asdf12345";
        server
            .get('/shop')
            .send(body)
            .expect(302)
            .end((err, res)=> {
                assert.equal(res.status, 302);
                console.log(res.header);
                done();
            })
    });
});