var http = require('http');

var server = require('express')();

var db = require('./db');

server.get('/', function (request, response) {
    db.all(function (err, data) {
        response.send(data);
    });
});

server.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Listening at http://%s:%s', host, port);
});
