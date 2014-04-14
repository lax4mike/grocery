var Backbone = require('backbone');
var NotificationModel = require('./NotificationModel.js');

// Notification Collection
var NotificationCollection = module.exports = Backbone.Collection.extend({

    model: NotificationModel
    
}); 