const server = require('supertest').agent("localhost:8080");
const assert = require('chai').assert;
const mock = require('./mock_data.js');
describe('server.js', function () {
    console.log('tests start');
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
        body.email = "T3STER1@AJZSHOE.COM";
        body.pwd = 'Asdf12345';
        body.pwd2 = 'Asdf12345';
        server
            .post('/register')
            .send(body)
            .expect(302)
            .end((err, res) => {
                assert.equal(res.status, 302);
                let sess = res.headers["set-cookie"] !== undefined;
                assert.equal(sess, true);
                done();
            });
    });

    it('/login should give you a sessionID', function (done) {
        body = {};
        body.email = "T3STER1@AJZSHOE.COM";
        body.pwd = "Asdf12345";
        server
            .post('/login')
            .send(body)
            .expect(302)
            .end((err, res) => {
                // assert.equal(res.status, 302);
                let sess = res.headers["location"] === '/home';
                assert.equal(sess, true);
                done();
            });
    });

    it('/shop should have status 200', (done)=>{
        body = {};
        body.email = "T3STER1@AJZSHOE.COM";
        body.pwd = "Asdf12345";
        server
            .post('/login')
            .send(body)
            .expect(200)
            .end((err, res) => {
                server
                    .get('/shop')
                    .expect(302)
                    .end((err,res1) => {
                        assert.equal(res1.status, 200);
                        if (res1.res.text.includes('Add to cart')){
                            sess = 1
                        }else {
                            sess = 0
                        }
                        assert.equal(sess, 1);
                        done();
                    })
            })

    });

    it('adding to cart /shop should have status 200',(done)=>{
        body = {};
        body.email = "T3STER1@AJZSHOE.COM";
        body.pwd = "Asdf12345";
        body.objectid = '5cd4fb1e1c9d4400008b3f0b';
        server
            .post('/login')
            .send(body)
            .expect(200)
            .end((err, res) => {
                server
                    .get('/shop')
                    .expect(200)
                    .end((err,res1) => {
                        server
                            .post('/add-to-cart')
                            .send(body)
                            .expect(302)
                            .end((err, res2) => {
                                assert.equal(res2.status, 302)
                                done();
                            });
                    })
            })

    });

    it('check add to cart /shop should have status 200', (done)=>{
        body = {};
        body.email = "T3STER1@AJZSHOE.COM";
        body.pwd = "Asdf12345";
        body.objectid = '5cd4fb1e1c9d4400008b3f0b';
        server
            .post('/login')
            .send(body)
            .expect(302)
            .end((err, res) => {
                server
                    .get('/shop')
                    .expect(200)
                    .end((err,res1) => {
                        server
                            .post('/add-to-cart')
                            .send(body)
                            .expect(302)
                            .end((err, res2) => {
                                assert.equal(res2.status, 302);
                                mock.checkcart();
                                done();
                            });
                    })
            })

    });

    it('/my_cart should have status 200', (done)=>{
        body = {};
        body.email = "T3STER1@AJZSHOE.COM";
        body.pwd = "Asdf12345";
        server
            .post('/login')
            .send(body)
            .expect(200)
            .end((err, res)=> {
                server
                    .get('/my_cart')
                    .expect(302)
                    .end((err,res1) => {
                        assert.equal(res.status, 302);
                        assert.equal(res1.req.path, '/my_cart');
                        if (res1.res.text.includes('My Cart')){
                            sess = 1
                        }else {
                            sess = 0
                        }
                        assert.equal(sess, 1);
                        done();
                    });
            });

    });

    it('/checkout should have empty cart and length of history 1', (done)=>{
        body = {};
        body.email = "T3STER1@AJZSHOE.COM";
        body.pwd = "Asdf12345";
        body.objectid = '5cd4fb1e1c9d4400008b3f0b';
        server
            .post('/login')
            .send(body)
            .expect(302)
            .end((error, response)=> {
                if (error){
                    console.log(error)
                }
                server
                    .get('/my_cart')
                    .expect(200)
                    .end((err, res)=>{
                        server
                            .post('/checkout')
                            .expect(302)
                            .end((e,r)=>{

                                mock.check_out();
                                done()
                            })
                    })
            })
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
                    let sess = res.headers["set-cookie"] === undefined;
                    assert.equal(sess, true);
                }
                mock.teardown();
                done();
            });
    });

});
