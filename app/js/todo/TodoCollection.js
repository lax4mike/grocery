var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var TodoModel = require('./TodoModel.js');
var TodoView = require('./TodoView.js');

// Todo Collection
var TodoCollection = module.exports = Backbone.Collection.extend({

    model: TodoModel,

    url: "items/",

    initialize: function(models, options) {

        this.$todos = $(options.selector);
        
        this.listenTo(this, "add", this.renderOneItem);
    },

    addNotificationCollection: function(notifications){

        this.notifications = notifications;

    },

    getNotifications: function(){

        if (!this.notifications){
            console.log("watch out! radioactive man!");
            return;
        }

        return this.notifications;
    },

    renderOneItem: function(model) {
        
        // add the todo
        var todoView = new TodoView({model: model});
        todoView.render();
        todoView.$el.addClass('collapsed');

        this.$todos.prepend(todoView.$el);

        // run this on the next frame, http://wilsonpage.co.uk/preventing-layout-thrashing/
        setTimeout(function(){
            todoView.$el.removeClass('collapsed');
        }, 0);

        // show undo notification if this item is trashed
        this.listenTo(todoView, "removeClicked", _.bind(function(e){
            this.getNotifications().createUndo([todoView.model]);
        }, this));
  
        
        
    }   

}); 