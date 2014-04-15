var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var NotificationModel = require('./NotificationModel.js');
var NotificationView = require('./NotificationView.js');

// Notification Collection
var NotificationCollection = module.exports = Backbone.Collection.extend({

	initialize: function(models, options) {

	    this.$notifications = $(options.selector); 

	    this.listenTo(this, "add", this.renderUndoNotification);
  
	    return this;
	},

    model: NotificationModel, 

    addTodoCollection: function(todos){
    	this.todos = todos;
    },

    getTodos: function(){

    	if (!this.todos){
    		console.log("uh ohs");
    		return;
    	}

    	return this.todos;
    },

    // given an array of TodoModels, create the undo notification
    createUndo: function(undoTodos){

        if (undoTodos.length == 0) return;

        var text = (undoTodos.length == 1) ? 
            undoTodos[0].get('text') : 
            undoTodos.length + " items";
        text += " deleted";

        var undoModel = new NotificationModel({
            text: text,
            buttonText: "undo",
            todos: undoTodos
        });
        this.add(undoModel);

    },

    renderUndoNotification: function(model) {

        var undoView = new NotificationView({model: model});
        undoView.render();
        undoView.$el.addClass('collapsed');

	    // on button click, undo item trash
        this.listenTo(undoView, 'buttonClick', _.bind(function(e){
            var undoTodos = undoView.model.get('todos');

            undoTodos.forEach(_.bind(function(model){ 
                model.unset('_id'); // undo id so backbone thinks it needs to POST (create) instead of PUT (update)
                this.getTodos().add(model);
                model.save(); 
            }, this));
            
        }, this));
        

        this.$notifications.append(undoView.$el);

        // hack to make it look collapsed
        setTimeout(function(){
            undoView.$el.removeClass('collapsed');
        }, 0);

        setTimeout(function(){
            undoView.trash();
        }, 10000);
    }
    
}); 