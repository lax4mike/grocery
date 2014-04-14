var Backbone = require('backbone');
var itemView = require('../todo/TodoView.js');

// Notification Model
var NotificationModel = module.exports = Backbone.Model.extend({

    defaults: {
        text: '',
        buttonText: ''
    },

});