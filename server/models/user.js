const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        unique: true,
        validate: {
            validator: function (value) {
                return validator.isEmail(value);
            },
            message: '{VALUE} is not a valid email address!'
        }
    },

    password: {
        type: String,
        required: true,
        minlength: 6,
    },

    tokens: [{
        access: {
            type: String,
            required: true
        },

        token: {
            type: String,
            required: true
        }
    }]
});

UserSchema.methods.toJSON = function () {
    var user = this;
    var userObject = user.toObject();

    return _.pick(userObject, ['_id', 'email']);
}

UserSchema.methods.generateAuthToken = function () {
    var user = this;
    var access = 'auth';
    var token = jwt.sign({
        _id: user._id.toHexString(),
        access
    }, 'abc123').toString();

    console.log('_id.toString():', user._id.toString());
    console.log('_id.toHexString():', user._id.toHexString());

    user.tokens.push({
        access,
        token
    });

    return user.save().then(() => {
        return token;
    })
}

UserSchema.statics.findByToken = function (token) {
    var user = this;
    var decoded;

    try {
        decoded = jwt.verify(token, 'abc123');
    } catch (e) {
        return new Promise((resolve, reject) => {
            reject("Bad token!");
        })

        //OK too
        // return Promise.reject("Token invalid!");
    };

    return User.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
};

// pre middleware, to hash the password before save the user
UserSchema.pre('save', function (next) {
    console.log("in pre save middleware.")
    var user = this;

    var password = user.password;

    console.log(password);

    console.log("Password is modified?", user.isModified("password"));


    // if in find(), isModified is false
    if (!user.isModified("password")) {
        next()
        return;
    }

    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(user.password, salt, (err, hash) => {
            console.log("Hashing password...");
            if (err) {
                console.log(err);
            }
            console.log(hash);
            user.password = hash;
            console.log("Password is modified?", user.isModified("password"));
            console.log(JSON.stringify(user));
            console.log();
            // if move next() call outside the bcrypt call, then original user will be saved.
            next();
            
        })
    })

})
var User = mongoose.model('User', UserSchema);


module.exports = {
    User
};