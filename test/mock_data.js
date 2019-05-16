// const server = require('supertest').agent("https://glacial-retreat-42071.herokuapp.com");
const MongoClient = require('mongodb').MongoClient;
const assert = require('chai').assert;
var ObjectId = require('mongodb').ObjectID;
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

const teardown_admin = () => {
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
    x = null;

    MongoClient.connect('mongodb+srv://admin:mongodb@agileproject-qha9t.mongodb.net/projectdb?retryWrites=true',function(err,client) {
        const db = client.db('projectdb');

        db.collection('Accounts').findOne({email: "T3STER1@AJZSHOE.COM"}, (err, doc)=>{
            // assert.equal(doc.cart.length,0);
            x = doc.cart.length
        });
        client.close();
        return x
    });
};

const check_history = () => {
    MongoClient.connect('mongodb+srv://admin:mongodb@agileproject-qha9t.mongodb.net/projectdb?retryWrites=true',function(err,client) {
        const db = client.db('projectdb');

        db.collection('Accounts').findOne({email: "T3STER1@AJZSHOE.COM"}, (err, doc)=>{
            assert.equal(doc.history.length,1);
        });

        client.close()
    });
};

module.exports = {
    checkcart,
    teardown,
    revert_price,
    teardown_admin,
    check_update,
    checkout,
    check_history
};