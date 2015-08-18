var fs = require('fs');
// npm
var assign = require('object-assign');

var FILENAME = './db.json';

var _cache;

read();

function read (callback) {
    _cache ? callback(null, _cache) : fs.readFile(FILENAME, function (err, database) {
        if (err)
            console.warn("Unexpected error reading database:\n", err.message);

        try {
            _cache = JSON.parse(database);
        }
        catch (e) {}

        _cache = _cache || [];

        callback && callback(null, _cache);
    });
}

function write (callback) {
    fs.writeFile(FILENAME, JSON.stringify(_cache, null, 4), function (err) {
        if (err)
            console.warn("Unexpected error writing database:\n", err.message);

        callback && callback(null, _cache);
    });
}
function all (callback) {
    read(callback);
}

function find (url, callback) {
    read(function (err, database) {
        database = database.filter(function (row) {
            return url === row.url
        });

        callback(err, data[0]);
    });
}

function upsert (url, data, callback) {
    if (! callback) {
        callback = data;
        data = void 0;
    }

    read(function (err, database) {
        var row = database.filter(function (row) {return url === row.url})[0];

        if (! row) {
            row = {url: url, createdAt: new Date()};
            database.push(row);
        }

        if (data)
            assign(row, data)


        write(function (err, database) {
            callback(err, row); // >>==> arrow, get it?
        });

    });
}

module.exports = {
    all: all, find: find, upsert: upsert
}
