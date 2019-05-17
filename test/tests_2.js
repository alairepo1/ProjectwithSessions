// const server = require('supertest').agent("localhost:8080");
const server = require('supertest').agent("https://glacial-retreat-42071.herokuapp.com");
const assert = require('chai').assert;
const mock = require('../test/mock_data.js');
const ObjectId = require('mongodb').ObjectID;

describe('server.js', function () {
    console.log('tests_2 start');

    it('/registerAdmin should give you a sessionID', function (done) {
        body = {};
        body.email = "T3STER2@AJZSHOE.COM";
        body.pwd = 'Asdf12345';
        body.pwd2 = 'Asdf12345';
        server
            .post('/registerAdmin')
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
                done()
            });
    });

    it('/admin shop status is 200', (done)=>{
        body = {};
        body.email = "T3STER2@AJZSHOE.COM";
        body.pwd = 'Asdf12345';
        server
            .post('/login')
            .send(body)
            .expect(302)
            .end((err, res)=>{
                if (err){
                    console.log(err)
                }
                server
                    .get('/shop')
                    .expect(200)
                    .end((error, response)=>{
                        if (error){
                            console.log(error)
                        }
                        compare = !!response.res.text.includes('Add Product');
                        // console.log(response.res.text)
                        assert.equal(response.status, 200);
                        assert.equal(compare, true);
                        done()
                    })
            })
    });

    it('/admin Add product shop status is 200', (done)=>{
        body = {
            _id: ObjectId("507f191e810c19729de860ea"),
            name: 'YeezyTest',
            type: 'Pirate Black',
            color: 'Black',
            price: '200.00',
            image: 'https://image-cdn.hypb.st/https%3A%2F%2Fhypebeast.com%2Fimage%2F2016%2F02%2Fadidas-yeezy-boost-350-pirate-black-restock-stock-list-1.jpg?q=75&w=800&cbr=1&fit=max'
        };
        server
            .post('/login')
            .send(body)
            .expect(302)
            .end((err, res)=>{
                if (err){
                    console.log(err)
                }
                server
                    .get('/shop')
                    .expect(200)
                    .end((error, response)=>{
                        // console.log(response.res.text)
                        server
                            .post('/addProduct')
                            .send(body)
                            .expect(302)
                            .end((error, response1) =>{
                                done()
                            })

                    })
            })
    }).timeout(5000);
    it('/admin checks for added shoe', (done)=>{
        body = {};
        body.email = "T3STER2@AJZSHOE.COM";
        body.pwd = 'Asdf12345';
        server
            .post('/login')
            .send(body)
            .expect(302)
            .end((err, res)=>{
                if (err){
                    console.log(err)
                }
                server
                    .get('/shop')
                    .expect(200)
                    .end((error, response)=>{
                        compare = !!response.res.text.includes('YeezyTest');
                        // console.log(response.res.text)
                        assert.equal(response.status, 200);
                        assert.equal(compare, true);
                        done()
                    })
            })

    });
    it('/updateProduct/:id changed price to 999.00', (done)=>{
        body = {
            name: 'YeezyTest',
            type: 'Pirate Black',
            color: 'Black',
            price: '999.00',
            path: 'https://image-cdn.hypb.st/https%3A%2F%2Fhypebeast.com%2Fimage%2F2016%2F02%2Fadidas-yeezy-boost-350-pirate-black-restock-stock-list-1.jpg?q=75&w=800&cbr=1&fit=max'
        };
        body.email = "T3STER2@AJZSHOE.COM";
        body.pwd = 'Asdf12345';

        server
            .post('/login')
            .send(body)
            .expect(302)
            .end((err, res)=>{
                server
                    .post("/updateProduct/507f191e810c19729de860ea")
                    .send(body)
                    .expect(302)
                    .end((err,res)=>{
                        assert.equal(res.status, 302);
                        server
                            .get('/product/507f191e810c19729de860ea')
                            .expect(200)
                            .end((error, response)=> {
                                assert.equal(response.res.text.includes('999.00'), true);
                            });

                        done()
                    })
            })
    });


    it('/admin checks for deleted shoe', (done)=>{
        body = {};
        body.email = "T3STER2@AJZSHOE.COM";
        body.pwd = 'Asdf12345';
        server
            .post('/login')
            .send(body)
            .expect(302)
            .end((err, res)=>{
                if (err){
                    console.log(err)
                }
                server
                    .post('/deleteProduct/507f191e810c19729de860ea')
                    .expect(302)
                    .end((error, response)=>{
                        server
                            .get('/shop')
                            .expect(200)
                            .end((error, response)=>{
                                compare = !!response.res.text.includes('YeezyTest');
                                // console.log(response.res.text)
                                assert.equal(response.status, 200);
                                assert.equal(compare, false);
                                done()
                            })
                    })
            })

    });


    it('TEARDOWNADMIN', (done)=> {
        mock.teardownadmin();
        done()
    });
});
