var _ = require('underscore');
var Backbone = require('backbone');


var undoTemplate = require('./templates/undo.handlebars');

var NotificationView = module.exports = Backbone.View.extend({

	tagName:  'li',
	
	template: undoTemplate,

	events: {
        'click button': 'buttonClick',
    },

    buttonClick: function() {
    	this.trigger('buttonClick');
    	this.remove();
    },

    trash: function(){
        this.$el.addClass('trash');
        this.$el.on("transitionend webkitTransitionEnd OTransitionEnd", _.bind(function(){ 
            this.remove();               
        }, this));
    },

	render: function() {
        this.$el.html(this.template(this.model.attributes));
        return this;
    },

});
