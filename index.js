var http = require('http');

var app = require('express')();

var db = require('./db');

app.get('/', function (request, response) {
    db.all(function (err, data) {
        response.send(data);
    });
});

app.get('/image/new', function (request, response) {
    db.insert(request.query.imageUrl, function (err, data) {
        response.send(data);
    });
});

var server = app.listen(3000, function () {
    console.log('Listening at', server.address().port);
});
