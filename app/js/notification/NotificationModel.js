var Backbone = require('backbone');

// Notification Model
var NotificationModel = module.exports = Backbone.Model.extend({

    defaults: {
        text: '',
        buttonText: '',
        todos: null // collection of TodoModels
    },

});