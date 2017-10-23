const SHA256 = require('crypto-js').SHA256;
const jwt = require('jsonwebtoken');

var message = "I am user number 3";
var hash = SHA256(message);
console.log('Message:', message);
console.log('HASH:', hash.toString());
console.log();

var data = {
    id: 10
}

var token = jwt.sign(data, '123abc');
console.log('toekn:', token);

var decode = jwt.verify(token, '123abc');
console.log('decoded:', decode);