var http = require('http');
var EventEmitter = require('events').EventEmitter;

var app = require('express')();
var users = [];
var emitter = new EventEmitter();

emitter.on('user add', function (user) {
    users.push(user);

    emitter.emit('users updated', users);
});

app.get('/api/users/add/:user', function (request, response) {
    emitter.once('users updated', response.send.bind(response));
    emitter.emit('user add', request.params.user);
});

app.listen(3000, function () {
    console.log("Listenting on", 3000)
});
