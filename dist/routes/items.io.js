var Items = require('./items.js');


module.exports = function(io){

    var items = new Items();

    io.sockets.on('connection', function (socket) {

        socket.on('items:read', function(data, ack){

            items.findAll(function(err, data){
                if (err){
                    ack(err, null);
                } else {
                    ack(null, data);    
                }
            });

        });


        socket.on('items:create', function(data, ack){

            items.addItem(data, function(err, data){
                if (err){
                    ack(err, null);
                    socket.broadcast.emit('items:create', err, null);
                } else {
                    ack(null, data);
                    socket.broadcast.emit('items:create', null, data);
                }
            });

        });

        socket.on('items:update', function(data, ack){

            items.updateItem(data._id, data, function(err, data){
                if (err){
                    ack(err, null);
                    socket.broadcast.emit('items:update', err, null);
                } else {
                    ack(null, data);
                    socket.broadcast.emit('items:update', null, data);
                }
            });
        });

        socket.on('items:delete', function(data, ack){

            items.deleteItem(data._id, function(err, data){
                if (err){
                    ack(err, null);
                    socket.broadcast.emit('items:delete', err, null);
                } else {
                    ack(null, data);
                    socket.broadcast.emit('items:delete', null, data);
                }
            });

        });

    });



}; // module.exports

 


