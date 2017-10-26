const SHA256 = require('crypto-js').SHA256;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


// hashing
var message = "I am user number 3";
var hash = SHA256(message);
console.log('Message:', message);
console.log('HASH:', hash.toString());
console.log();


// json web token
var data = {
    id: 10
}

var token = jwt.sign(data, '123abc');
console.log('toekn:', token);

var decode = jwt.verify(token, '123abc');
console.log('decoded:', decode);
console.log();

// bcrypt

var password = '123456';

bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
        console.log("in bcrypt.hash");
        if(err) {
            console.log(err);
        }
        console.log(hash);
    })
})

var hashedPassword = '$2a$17$RmDgo0yX525sVuYERRWE5.jVuyOlbrmbKyxmNCZLNh9WU8XcL6LL.';
bcrypt.compare(password, hashedPassword, (err, res) => {
    console.log("Password match?", res);
});
