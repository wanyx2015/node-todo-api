var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp');

var Todo = mongoose.model('Todo', {
    text: {
        type: String
    },
    completed: {
        type: Boolean
    },
    completedAt: {
        type: Number
    }
})

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