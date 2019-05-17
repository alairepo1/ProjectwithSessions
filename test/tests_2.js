const server = require('supertest').agent("localhost:8080");
const assert = require('chai').assert;
const mock = require('./mock_data.js');
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
                        if (response.res.text.includes('Add Product')){
                            compare = true
                        }else{
                            compare = false
                        }
                        // console.log(response.res.text)
                        assert.equal(response.status, 200);
                        assert.equal(compare, true);
                        done()
                    })
            })
    });

    it('/updateProduct/:id changed price to 999.00', (done)=>{
        body = {
            image: "https://i1.adis.ws/t/jpl/jdie_product_list?plu=jd_131362_a&qlt=80&w=300&h=300&v=1",
            type: "Nike",
            name: "Air Max",
            color: "Black",
            price: 999.00
        };
        body.email = "T3STER2@AJZSHOE.COM";
        body.pwd = 'Asdf12345';

        server
            .post('/login')
            .send(body)
            .expect(302)
            .end((err, res)=>{
                server
                    .post("/updateProduct/5cd4fb1e1c9d4400008b3f0b")
                    .send(body)
                    .expect(302)
                    .end((err,res)=>{
                        assert.equal(res.status, 302);
                        //Checks price of changed item equal to 999.00
                        mock.check_update();
                        //Reverts price change back to 150.00
                        mock.revert_price();
                        done()
                    })
            })
    });

    it("/logout should clear the cookie", (done) => {
        server
            .get('/logout')
            .expect(200)
            .end(async(err, res) => {
                assert.equal(res.status, 302);
                try{
                    let sess = res.headers["set-cookie"][0].includes('sid=;');
                    assert.equal(sess, true);
                }
                catch (e) {
                    let sess = res.headers["set-cookie"] === undefined;
                    assert.equal(sess, true);
                }
                x = await mock.teardown_admin();

                done()
            });
    });
});

    it('/admin Add product shop status is 200', (done)=>{
        body = {};
        body.email = "T3STER1ADMIN@AJZSHOE.COM";
        body.pwd = 'Asdf12345';
        body.name = 'JordanAdmintest';
        body.type = 'Black Shoe';
        body.color = 'Black';
        body.price = '120.00';
        body.image = 'https://i1.adis.ws/t/jpl/jdie_product_list?plu=jd_131362_a&qlt=80&w=300&h=300&v=1';
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
        body.email = "T3STER1ADMIN@AJZSHOE.COM";
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
                        compare = !!response.res.text.includes('JordanAdmintest');
                        // console.log(response.res.text)
                        assert.equal(response.status, 200);
                        assert.equal(compare, true);
                        // mock.teardownadmin();
                        done()
                    })
            })
    });





