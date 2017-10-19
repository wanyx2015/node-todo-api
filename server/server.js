var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();

app.use(bodyParser.urlencoded({ extended: true}));

app.use(bodyParser.json())

app.post('/todos', (req, res) =>{
    console.log(req.body);
    
    var todo = new Todo(req.body);
    
    todo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    })
});

app.get('/todos', (req, res) =>{
    console.log(req.body);
    
    Todo.find().then( (docs) => {
        res.send({
            docs,
            status: true
        });
    }, (e) => {
        res.status(500).send(e);
    })
  
    
});

app.listen(3000, () => {
    console.log('Server started on port 3000');
})

// var newTodo = Todo({
//     text: "Cook dinner"
// })

// newTodo.save().then((doc) => {
//     console.log(doc);
// }, (err) => {
//     console.log("Unable to create doc.")
// })

// var otherTodo = Todo({
//     text: "Fix the laptop",
//     completed: true,
//     completedAt: 123,
//     // below field won't save to db
//     newF: 111
// }).save().then((doc) => {
//     console.log(doc);
// }, (err) => {
//     console.log("Unable to create doc.")
// })