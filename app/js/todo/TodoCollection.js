var Backbone = require('backbone');
var TodoModel = require('./TodoModel.js');

// Todo Collection
var TodoCollection = module.exports = Backbone.Collection.extend({

    model: TodoModel,

    url: "/items/"

}); 