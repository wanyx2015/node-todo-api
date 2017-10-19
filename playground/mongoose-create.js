
const {ObjectID} = require('mongodb');
const {mongoose} = require('../server/db/mongoose');
const {Todo} = require('../server/models/todo');
const {User} = require('../server/models/user');


var newTodo = Todo({
    text: "Cook dinner"
})

newTodo.save().then((doc) => {
    console.log(doc);
}, (err) => {
    console.log("Unable to create doc.")
})

var otherTodo = Todo({
    text: "Fix the laptop",
    completed: true,
    completedAt: 123,
    // below field won't save to db
    newF: 111
}).save().then((doc) => {
    console.log(doc);
}, (err) => {
    console.log("Unable to create doc.")
})