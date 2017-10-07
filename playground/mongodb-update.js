const MongoClient = require('mongodb').MongoClient;

// const {
//     MongoClient,
//     ObjectID
// } = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {

    if (err) {
        return console.log('Unable to connect to MongoDB server.');
    }

    console.log('Connected to MongoDB server.')

    // deleteMany
    // db.collection('Todos').deleteMany({text: 'Something todo'}).then((data) => {
    //     console.log(data.result);
    // });

    // deleteOne
    // db.collection('Todos').deleteOne({text: 'Something todo'}).then((data) => {
    //     console.log(data.result);
    // });


    // findOneAndDelete
    db.collection('Todos').findOneAndUpdate({
            text: 'Something todo'
        }, {
            $set: {
                text: "Go to supermarket"
            }
        },
        true
    ).then((data) => {
        console.log(data);
    });


    db.close();

})