var express = require('express'),
	items   = require('./routes/items.js');


var app = express();
app.configure(function () {
    app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser());
    app.use(express.static(__dirname + '/public/'));
    app.use(express.favicon(__dirname + '/public/favicon.ico'));
});

app.get('/', function(req, res){
	res.sendfile(__dirname + '/public/index.htm');
});

app.get('/items', items.findAll);
app.get('/items/:id', items.findById);
app.post('/items', items.addItem);
app.put('/items/:id', items.updateItem);
app.delete('/items/:id', items.deleteItem);


app.listen(3000);
console.log('Listening on port 3000...');

module.exports = app;

