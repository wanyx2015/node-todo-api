const {
    ObjectID
} = require('mongodb');
const {
    mongoose
} = require('../server/db/mongoose');
const {
    Todo
} = require('../server/models/todo');
const {
    User
} = require('../server/models/user');

var id = '59e81a3231528f3de2899f76';

if (!ObjectID.isValid(id)) {
    console.log("Invalid Object ID:", id);
    return (1);
} else {
    console.log("Valid Object ID:", id);
}


// Todo.remove({})

// Todo.findOneAndRemove

// Todo.findByIdAndRemove

// Todo.remove({}).then((docs) => {
//     console.log(docs.result);
// }, (e) => {
//     console.log(e);
// })

// Todo.findOneAndRemove({
//     _id: id
// }).then((doc) => {
//     console.log('Todo removed: ', doc);
//     console.log();
// })



Todo.findByIdAndRemove(id).then((doc) => {
    console.log('Todo By ID removed: ', doc);
    console.log();
}).catch((e) => {
    console.log(e);
})