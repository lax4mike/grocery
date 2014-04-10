var Backbone = require('backbone');

// Todo Model
var TodoModel = module.exports = Backbone.Model.extend({

    defaults: {
        text: '',
        done: false,
        POO: false 
    },

    idAttribute: "_id"

});