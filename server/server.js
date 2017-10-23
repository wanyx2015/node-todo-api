const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const ObjectID = require('mongodb').ObjectID;
const mongoose = require('./db/mongoose').mongoose;
const Todo = require('./models/todo').Todo;
const User = require('./models/user').User;
const authenticate = require('./middleware/authenticate').authenticate;

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


/////////////////////////////////////////// USER PART ////////

// GET /users/me
app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});

// GET USERS
app.get('/users', (req, res) => {
    User.find().then((data) => {

        // for(var i =0; i<data.length; i++){
        //     console.log(data[i]);
        //     console.log(data[i]._id.getTimestamp());
        //     data[i].timeStamp = data[i]._id.getTimestamp();
        //     console.log(data[i]);
        // }

        data.forEach((item) => {
            console.log(item._id.getTimestamp());
        });

        res.send(data);
    }).catch((e) => {
        res.send(e);
    });
})

// POST USERS 
app.post('/users', (req, res) => {
    console.log(req.body);
    var body = _.pick(req.body, ['email', 'password']);
    var user = new User(body);

    user.save().then((u) => {
            return u.generateAuthToken();
            // res.send(doc);
        }).then((token) => {
            res.header('x-auth', token).send(user);
        })
        .catch((e) => {
            res.status(400).send({
                "status": false,
                "error": e
            });
        })
})


app.listen(port, () => {
    console.log(`Server started on port ${port}`);
})