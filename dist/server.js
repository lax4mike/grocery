var express = require('express'),
    app     = express(),
    server  = require('http').createServer(app);

// setup socket.io
var io = require('socket.io').listen(server);
io.set('log level', 2); // https://github.com/LearnBoost/Socket.IO/wiki/Configuring-Socket.IO

app.configure(function () {
    app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.json());  // for parsing json
    app.use(express.static(__dirname + '/public/'));
    app.use(express.favicon(__dirname + '/public/favicon.ico'));
});

app.get('/', function(req, res){
    res.sendfile(__dirname + '/public/index.htm');
});

var ItemsIO = require('./routes/items.io.js');
var items = new ItemsIO(io);

// var Items = require('./routes/items.js');
// var items = new Items(app);


server.listen(3000);
console.log('Listening on port 3000...');

module.exports = app;

