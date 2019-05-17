const server = require('supertest').agent("https://glacial-retreat-42071.herokuapp.com");
// const server = require('supertest').agent("http://localhost:8080");
const assert = require('chai').assert;
const mock = require('../test/mock_data.js');

describe('server.js', function () {
    it('/ endpoint should render homepage', function (done) {
        mock.setupShoe();
        server
            .get('/')
            .expect(200)
            .expect("Content-type", /html/)
            .end((err, res) => {
                if (err){
                    console.log(err)
                }
                assert.equal(res.status, 200);
                done();
            });
    }).timeout(5000);
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
                if (err){
                    console.log(err)
                }
                assert.equal(res.status, 302);
                let sess = res.header["set-cookie"] !== undefined;
                assert.equal(sess, true);
                done();
            });
    });
    it("/logout should clear the cookie", (done) => {
        server
            .get('/logout')
            .expect(302)
            .end((err, res) => {
                if (err){
                    console.log(err)
                }
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
        body.email = "T3STER1@AJZSHOE.COM";
        body.pwd = "Asdf12345";
        server
            .post('/login')
            .send(body)
            .expect(302)
            .end((err, res) => {
                if (err){
                    console.log(err)
                }
                assert.equal(res.status, 302);
                let sess = res.headers["location"] === '/home';
                assert.equal(sess, true);
                done();
            });
    });

    it('/checkout should have empty cart and length of history 1', (done)=>{
        body = {};
        body.email = "T3STER1@AJZSHOE.COM";
        body.pwd = "Asdf12345";
        body.objectid = '5cdee65ca866cd3ff472b5ea';

        server
            .post('/login')
            .send(body)
            .expect(302)
            .end((error, response)=> {
                if (error){
                    console.log(error)
                }
                server
                    .get('/shop')
                    .expect(200)
                    .end((err, res)=>{
                        server
                            .post('/add-to-cart')
                            .expect(302)
                            .send(body)
                            .end((e,r)=> {
                                server
                                    .post('/checkout')
                                    .expect(200)
                                    .end((ERR, RES) => {
                                        if (ERR) {
                                            console.log(ERR)
                                        }
                                        mock.checkout();
                                        mock.check_history();
                                        done();
                                    })
                            })

                    })
            })
    }).timeout(10000);

    it('/shop should have status 200', (done)=>{
        body = {};
        body.email = "T3STER1@AJZSHOE.COM";
        body.pwd = "Asdf12345";
        server
            .post('/login')
            .send(body)
            .expect(302)
            .end((err, res) => {
                if (err){
                    console.log(err)
                }
                server
                    .get('/shop')
                    .expect(200)
                    .end((err,res1) => {
                        if (err){
                            console.log(err)
                        }
                        assert.equal(res1.status, 200);
                        if (res1.res.text.includes('Shop')){
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
        body.objectid = "507f191e810c19729de860ea";
        server
            .post('/login')
            .send(body)
            .expect(302)
            .end((err, res) => {
                if (err){
                    console.log(err)
                }
                server
                    .get('/shop')
                    .expect(200)
                    .end((err,res1) => {
                        if (err){
                            console.log(err)
                        }
                        server
                            .post('/add-to-cart')
                            .send(body)
                            .expect(302)
                            .end((err, res2) => {
                                if (err){
                                    console.log(err)
                                }
                                done();
                            });
                    })
            })

    }).timeout(10000);
    it('/my_cart should have status 200', (done)=>{
        body = {};
        body.email = "T3STER1@AJZSHOE.COM";
        body.pwd = "Asdf12345";
        server
            .post('/login')
            .send(body)
            .expect(302)
            .end((err, res)=> {
                if (err){
                    console.log(err)
                }
                server
                    .get('/my_cart')
                    .expect(200)
                    .end((err,res1) => {
                        if (err){
                            console.log(err)
                        }
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

    }).timeout(5000);

    it('Removing from cart /my_cart should have status 200', (done)=>{
        body = {};
        body.email = "T3STER1@AJZSHOE.COM";
        body.pwd = "Asdf12345";
        body.item_id = "507f191e810c19729de860ea";
        body.remove_num = "2";
        body.quantity = "1";
        server
            .post('/login')
            .send(body)
            .expect(302)
            .end((err, res)=> {
                if (err){
                    console.log(err)
                }
                server
                    .post('/delete-item')
                    .send(body)
                    .expect(302)
                    .end((err, res2) => {
                        if (err){
                            console.log(err)
                        }
                        server
                            .get('/my_cart')
                            .expect(200)
                            .end((err,res3) => {
                                if (err) {
                                    console.log(err)
                                }
                                done();
                            })

                    });
            });

    }).timeout(5000);

    it('check remove /my_cart should have status 200', (done)=> {
        body = {};
        body.email = "T3STER1@AJZSHOE.COM";
        body.pwd = "Asdf12345";
        server
            .post('/login')
            .send(body)
            .expect(302)
            .end((err, res)=> {
                if (err){
                    console.log(err)
                }
                console.log(res.res.text);
                server
                    .get('/my_cart')
                    .expect(200)
                    .end((err,res1) => {
                        if (err){
                            console.log(err)
                        }
                        if (res1.res.text.includes('YeezyTest')){
                            sess = 1
                        }else {
                            sess = 0
                        }
                        assert.equal(sess, 0);
                        done();
                    });
            });
    });

    it('TEARDOWN', (done)=> {
        mock.teardown();
        done()
    });

});