// const MongoClient = require('mongodb').MongoClient;

const {
    MongoClient,
    ObjectID
} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {

    if (err) {
        return console.log('Unable to connect to MongoDB server.');
    }

    console.log('Connected to MongoDB server.')


    db.collection("Todos").find({}).toArray().then((docs) => {
        console.log("ALL Todos");
        console.log(JSON.stringify(docs, null, 2));
    }, (err) => {
        console.log("Unable to fetch the documents", err);
    });

    db.collection("Todos").find({
        completed: true
    }).toArray().then((docs) => {
        console.log("ALL Todos completed");
        console.log(JSON.stringify(docs, null, 2));
    }, (err) => {
        console.log("Unable to fetch the documents", err);
    });

    db.collection("Todos").find({
        _id: new ObjectID('59d7a19ce5bbf00681b43998')
    }).toArray().then((docs) => {
        console.log("Todos with ID");
        console.log(JSON.stringify(docs, null, 2));
    }, (err) => {
        console.log("Unable to fetch the documents", err);
    });

    db.collection("Todos").find({}).count().then((count) => {
        console.log(`Todos count with promise: ${count}`);
    }, (err) => {
        console.log("Unable to fetch the documents", err);
    });

    // if no callback passed, it passes a promise
    db.collection("Todos").find({}).count((err, count) => {
        if (err) {
            return console.log("Unable to get Todos count");
        }
        console.log(`Todos count with callback: ${count}`);
    });

    db.close();

})