
const {ObjectID} = require('mongodb');
const {mongoose} = require('../server/db/mongoose');
const {Todo} = require('../server/models/todo');
const {User} = require('../server/models/user');

var id = '59e7f4288aaaa93489c98e22';

if (!ObjectID.isValid(id)) {
    console.log("Invalid Object ID:", id);
    return(1);
} else {
    console.log("Valid Object ID:", id);
}

Todo.find({
    _id: id
}).then( (doc) => {
    console.log('Todos: ', doc);
    console.log();
})

Todo.findOne({
    _id: id
}).then( (doc) => {
    console.log('Todo: ', doc);
    console.log();
})

Todo.findById(id).then( (doc) => {
    console.log('Todo By ID: ', doc);
    console.log();
}).catch((e) => {
    console.log(e);
})