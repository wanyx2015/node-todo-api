var express = require('express');
var bodyParser = require('body-parser');
var ObjectID = require('mongodb').ObjectID;
var mongoose = require('./db/mongoose').mongoose;
var Todo = require('./models/todo').Todo;
var User = require('./models/user').User;

const port = process.env.PORT || 3000;

var app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json())

// POST /todos
app.post('/todos', (req, res) => {
    console.log(req.body);

    var todo = new Todo(req.body);

    todo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    })
});

// GET /todos
app.get('/todos', (req, res) => {
    console.log(req.body);

    Todo.find().then((docs) => {
        res.send({
            docs,
            status: true
        });
    }, (e) => {
        res.status(500).send(e);
    })
});

// GET /todo/12345
app.get('/todos/:id', (req, res) => {

    var id = req.params.id;

    if (!ObjectID.isValid(id)) {
        console.log(`Invalid object id: ${id}`);
        return res.status(404).send(`Invalid object id: ${id}`);
    }

    // Catch error instead of error handler
    Todo.findById(id).then((doc) => {
        console.log(doc);
        if (!doc) {
            return res.status(404).send("No document found!");
        }
        res.send({
            doc,
            status: true
        });
    }).catch((e) => {
        res.status(400).send(e);
    })

}, (e) => {
    res.status(400).send(e);
})



// GET /todo/12345
app.delete('/todos/:id', (req, res) => {

    var id = req.params.id;

    if (!ObjectID.isValid(id)) {
        console.log(`Invalid object id: ${id}`);
        return res.status(404).send(`Invalid object id: ${id}`);
    }

    // Catch error instead of error handler
    Todo.findByIdAndRemove(id).then((doc) => {
        console.log(doc);
        if (!doc) {
            return res.status(404).send("No document found!");
        }
        res.send({
            doc,
            status: true
        });
    }).catch((e) => {
        res.status(400).send(e);
    })

}, (e) => {
    res.status(400).send(e);
})


app.listen(port, () => {
    console.log(`Server started on port ${port}`);
})