var fs = require('fs');

var FILENAME = './db.json';

function read (callback) {
    fs.readFile(FILENAME, function (err, database) {
        if (err)
            console.warn("Unexpected error reading database:\n", err.message);

        database = database ? JSON.parse(database) : [];

        callback && callback(null, database);
    });
}

function write (database, callback) {
    fs.writeFile(FILENAME, JSON.stringify(database, null, 4), function (err) {
        if (err)
            console.warn("Unexpected error writing database:\n", err.message);

        callback && callback(null, database);
    });
}

module.exports = {
    all: function all (callback) {
        read(callback);
    },

    insert: function insert (url, callback) {
        read(function (err, data) {
            data.push({url: url, createdAt: new Date()});

            write(data, callback);
        });
    }
}
