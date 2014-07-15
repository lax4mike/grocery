var Backbone = require('backbone'); 
var socket = Backbone.socket;


module.exports = function(app){


	socket.on('connect', function () {

	    socket.on('items:create', function(err, data){
	    	// console.log('create!', data);
	        app.saveTodo(data);
	    });

	    socket.on('items:update', function(err, data){
	        // console.log("update!!", data);
	        app.updateItemByObject(data);
	    });


	    socket.on('items:delete', function(err, data){
	        // console.log("delete!!", data);
	        app.deleteTodoById(data);
	    });
 
	});


};