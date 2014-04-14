var _ = require('underscore');
var $ = require('jquery');
var Backbone = require('backbone');

var todoTemplate = require('./templates/todo.handlebars');

// Todo View
var TodoView = module.exports = Backbone.View.extend({

    tagName:  'li',

    initialize: function(){

        this.listenTo(this.model, 'trash', this.trashTodo);

    },

    trashTimeout: null,

    template: todoTemplate,

    events: {
        'change input[type=checkbox]': 'toggleCheckbox',
        'click .remove': 'removeClicked',
    },

    updateCheckbox: function(e) {
        var checked = this.$el.find('input[type=checkbox]').is(':checked');
        this.$el.toggleClass("checked", checked);
        return checked;
    },
    toggleCheckbox: function(e) {
        var checked = this.updateCheckbox();
        this.model.set("done", checked);
        this.model.save();
    },

    removeClicked: function(e) {
        this.trigger('removeClicked');
        this.trashTodo();
    },

    // animation
    trashTodo: function(){
        this.$el.addClass('trash');

        var transitions = 0;

        this.$el.on("transitionend webkitTransitionEnd OTransitionEnd", _.bind(function(){ 
            // this animation is 2 transitions (translateX(), height)
            if (++transitions >= 2){

                // show undo and set timeout to actually delete this item
                this.trigger('trashed');
                this.removeTodo();               
            }
        }, this));
    },

    // removes the todo from the server
    removeTodo: function(e) {
        this.trigger('removed');
        this.model.destroy();

        this.remove(); 
    },

    render: function() {
        this.$el.html(this.template(this.model.attributes));
        this.updateCheckbox();
        return this;
    },

});