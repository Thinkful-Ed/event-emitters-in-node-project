var http = require('http');

var app = require('express')();
var users = [];

app.get('/api/users/add/:user', function (request, response) {
    users.push(request.params.user);

    response.send(users);
});

app.listen(3000, function () {
    console.log("Listenting on", 3000)
});
