const server = require('supertest').agent("https://glacial-retreat-42071.herokuapp.com");
const MongoClient = require('mongodb').MongoClient;
const assert = require('chai').assert;
const ObjectId = require('mongodb').ObjectID;

const teardown = () => {
    MongoClient.connect('mongodb+srv://admin:mongodb@agileproject-qha9t.mongodb.net/projectdb?retryWrites=true',function(err,client) {
        const db = client.db('projectdb');
        if (err) {
            console.log(err);
        }
        else {
            console.log("Connected to db");


            db.collection('Accounts').remove({email: "T3STER1@AJZSHOE.COM"}, function (err, data) {

                if (err) {
                    throw(err);
                }
                else {
                    console.log("Test Ended Database cleared");
                    client.close();
                }

            })
        }

    })
};


const checkcart = () => {
    MongoClient.connect('mongodb+srv://admin:mongodb@agileproject-qha9t.mongodb.net/projectdb?retryWrites=true',function(err,client) {
        const db = client.db('projectdb');


        db.collection('Accounts').findOne({email: "T3STER1@AJZSHOE.COM"}, function (err, data) {

            if (err) {
                throw(err);
            }
            else {
                assert.equal(data.cart[0].name, "Air Max");
                client.close()
            }
        });
    });
};



const teardownadmin = () => {
    MongoClient.connect('mongodb+srv://admin:mongodb@agileproject-qha9t.mongodb.net/projectdb?retryWrites=true',function(err,client) {
        const db = client.db('projectdb');
        if (err) {
            console.log(err);
        }
        else {
            db.collection('Accounts').remove({email: "T3STER2@AJZSHOE.COM"})
        }

    })
};

const check_update = () => {
    MongoClient.connect('mongodb+srv://admin:mongodb@agileproject-qha9t.mongodb.net/projectdb?retryWrites=true',function(err,client) {
        const db = client.db('projectdb');

        db.collection('Shoes').findOne({id: ObjectId('5cd4fb1e1c9d4400008b3f0b')}, (err, doc)=>{
            assert.equal(doc.price, 999.00)
        });

        client.close()
    });
};

const revert_price = () => {
    MongoClient.connect('mongodb+srv://admin:mongodb@agileproject-qha9t.mongodb.net/projectdb?retryWrites=true',function(err,client) {
        const db = client.db('projectdb');

        db.collection('Shoes').findOneAndUpdate({_id: ObjectId('5cd4fb1e1c9d4400008b3f0b')},
            {$set: {price: 150.00}}
            );

        client.close()
    });

};

const checkout = () => {

    MongoClient.connect('mongodb+srv://admin:mongodb@agileproject-qha9t.mongodb.net/projectdb?retryWrites=true',function(err,client) {
        const db = client.db('projectdb');

        db.collection('Accounts').findOne({email: "T3STER1@AJZSHOE.COM"}, (err, doc)=>{
            assert.equal(doc.cart.length,0);
        });
        client.close();
    });
};

const check_history = () => {
    MongoClient.connect('mongodb+srv://admin:mongodb@agileproject-qha9t.mongodb.net/projectdb?retryWrites=true',function(err,client) {
        const db = client.db('projectdb');

        db.collection('Accounts').findOne({email: "T3STER1@AJZSHOE.COM"}, (err, doc) => {
            assert.equal(doc.history.length, 1);
        });

        client.close()
    })
};

const setupShoe = () => {
    MongoClient.connect('mongodb+srv://admin:mongodb@agileproject-qha9t.mongodb.net/projectdb?retryWrites=true',function(err,client) {
        const db = client.db('projectdb');

        db.collection("Shoes").insertOne(
            {
                _id: ObjectId("507f191e810c19729de860ea"),
                name: 'YeezyTest',
                type: 'Pirate Black',
                color: 'Black',
                price: '200.00',
                path: 'https://image-cdn.hypb.st/https%3A%2F%2Fhypebeast.com%2Fimage%2F2016%2F02%2Fadidas-yeezy-boost-350-pirate-black-restock-stock-list-1.jpg?q=75&w=800&cbr=1&fit=max'
            }
        );

        client.close();

    });
};

const emptycheckcart = () => {
    MongoClient.connect('mongodb+srv://admin:mongodb@agileproject-qha9t.mongodb.net/projectdb?retryWrites=true',function(err,client) {
        const db = client.db('projectdb');


        db.collection('Accounts').findOne({email: "T3STER1@AJZSHOE.COM"}, function (err, data) {

            if (err) {
                throw(err);
            }
            else {
                assert.deepEqual(data.cart, []);
                client.close()
            }
        });

    });
};

module.exports = {
    checkcart,
    teardown,
    teardownadmin,
    check_update,
    revert_price,
    checkout,
    check_history,
    setupShoe,
    emptycheckcart


};