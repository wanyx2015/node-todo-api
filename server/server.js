const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const ObjectID = require('mongodb').ObjectID;
const mongoose = require('./db/mongoose').mongoose;
const Todo = require('./models/todo').Todo;
const User = require('./models/user').User;

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

// DELETE /todo/12345
app.delete('/todos/:id', (req, res) => {
    var id = req.params.id;
    if (!ObjectID.isValid(id)) {
        console.log(`Invalid object id: ${id}`);
        return res.status(404).send(`Invalid object id: ${id}`);
    }

    // Catch error instead of error handler
    Todo.findByIdAndRemove(id).then((doc) => {
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

// PATCH /todo/12345
app.patch('/todos/:id', (req, res) => {

    console.log('PATCH request body:', req.body);
    console.log('PATCH request params', req.params);

    var id = req.params.id;
    // accepted fields that user can change
    var body = _.pick(req.body, ['text', 'completed']);

    if (!ObjectID.isValid(id)) {
        console.log(`Invalid object id: ${id}`);
        return res.status(404).send(`Invalid object id: ${id}`);
    }




    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completedAt = null;
        body.completed = false;
    }

    // Catch error instead of error handler
    Todo.findByIdAndUpdate(id, {
        $set: body
    }, {
        new: true
    }).then((doc) => {
        if (!doc) {
            return res.status(404).send("No document found!");
        }

        res.send({
            doc,
            status: true
        });
    }).catch((e) => {
        res.status(404).send(e);
    })

}, (e) => {
    res.status(404).send(e);
})

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
})