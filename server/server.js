const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const ObjectID = require('mongodb').ObjectID;
const mongoose = require('./db/mongoose').mongoose;
const Todo = require('./models/todo').Todo;
const User = require('./models/user').User;
const authenticate = require('./middleware/authenticate').authenticate;
const jwt = require('jsonwebtoken');

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

// Login
app.post('/users/login', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);

    User.findByCredentials(body.email, body.password).then((user) => {
        user.generateAuthToken().then((token) => {
            console.log("TOKEN", token);
            res.header('x-auth', token).send(user);
        });
    }).catch((e) => {
        res.status(400).send("Authentication failed!");
    });
})

// Logout
app.delete('/users/me/token', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send("Logout successfully!");
    }, () => {
        res.status(400).send("Unauthorized!");
    });
});

// Populate db with users and todos
app.post('/populate', (req, res) => {
    const userOneId = new ObjectID();
    const userTwoId = new ObjectID();

    const users = [{
            _id: userOneId,
            email: 'andrew@example.com',
            password: 'userOnePass',
            tokens: [{
                access: 'auth',
                token: jwt.sign({
                    _id: userOneId,
                    access: 'auth'
                }, 'abc123').toString()
            }]
        },
        {
            _id: userTwoId,
            email: 'jen@example.com',
            password: 'userTwoPass'
        }
    ]

    const todos = [{
        _id: new ObjectID(),
        text: 'First todo!'
    }, {
        _id: new ObjectID(),
        text: 'Second todo!',
        completed: true,
        completedAt: new Date().getTime()
    }]

    User.remove({}).then(() => {

        Todo.remove({}).then(() => {
            var userOne = new User(users[0]).save();
            var userTwo = new User(users[1]).save();
            var todoOne = new Todo(todos[0]).save();
            var todoTwo = new Todo(todos[1]).save();

            Promise.all([userOne, userTwo, todoOne, todoTwo]).then((data) => {
                res.send(data);
            });
        })


    })
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
})