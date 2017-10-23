const User = require('../models/user').User;

var authenticate = (req, res, next) => {
    var token = req.header('x-auth');

    User.findByToken(token).then((user) => {
        if (!user) {
            return Promise.reject("USER NOT FOUND!");
        }

        req.user = user;
        req.token = token;

        next();
        // res.send(user);
    }).catch((e) => {
        res.status(401).send("Authentication required!");
    })
}

module.exports = {authenticate};