var Backbone = require('backbone');

// Todo Model
var TodoModel = module.exports = Backbone.Model.extend({

    defaults: {
        text: '',
        done: false
    },

    idAttribute: "_id",

    // "trash" event

});