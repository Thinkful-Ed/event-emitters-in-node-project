var EventEmitter = require('events').EventEmitter;
var fs = require('fs');
// npm
var request = require('request');
var md5 = require('md5');


var app = require('express')();
var db = require('./db');
var publisher = new EventEmitter();

var emit = publisher.emit;
publisher.emit = function () {
    console.log(arguments[0]);
    return emit.apply(publisher, arguments);
};

publisher.on('image:new', function (imageUrl) {
    db.upsert(imageUrl, function (err, data) {
        publisher.emit('image:stored');
    });
});

publisher.on('image:new', function (imageUrl) {
    // Archive image
    request({url: imageUrl, encoding: 'binary'}, function (err, response, body) {
        if (err) {
            publisher.emit('image:archive:error', imageUrl, err);
            return;
        }

        var path = './static/' + md5(imageUrl) + '.' + imageUrl.split('.').pop();

        fs.writeFile(path, body, 'binary', function (err) {
            if (err) {
                publisher.emit('image:archive:error', imageUrl, err);
                return;
            }
            db.upsert(imageUrl, {path: path}, function (err, data) {
                // Emit archive success event
                publisher.emit('image:archived', imageUrl, data);
            });
        })

    })
});

publisher.on('image:archive:error', function (imageUrl, err) {
    console.warn("Error archiving image", imageUrl, err)
})

app.get('/', function (request, response) {
    db.all(function (err, data) {
        response.send(data);
    });
});

app.get('/image/new', function (request, response) {
    publisher.once('image:stored', function () {
        response.sendStatus(200);
    });

    publisher.emit('image:new', request.query.imageUrl);
});

var server = app.listen(3000, function () {
    console.log('Listening at', server.address().port);
});
