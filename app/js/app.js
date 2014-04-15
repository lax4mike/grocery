
var $ = require('jquery'); 
var _ = require('underscore');
var Backbone = require('backbone'); 
Backbone.$ = $;

var TodoCollection = require('./todo/TodoCollection.js');
var TodoModel = require('./todo/TodoModel.js');

var NotificationCollection = require('./notification/NotificationCollection.js');

var todos = new TodoCollection([], {
    selector: "#todo-list"
});

var notifications =  new NotificationCollection([], {
    selector: '#notifications'
});

todos.addNotificationCollection(notifications);
notifications.addTodoCollection(todos);

var ApplicationView = Backbone.View.extend({

    el: 'body',

    initialize: function() {

        this.$todoText = $('#todo-add .todo-text');
        this.$list = $('#todo-list');

        todos.fetch();

    },

    events: {
        'keypress #todo-add .todo-text': 'addTodoEnter',
        // 'keyup #todo-add .todo-text': 'addTodoEnter',
        'keydown #todo-add .todo-text': 'addTodoEnter',
        'click #todo-add .submit': 'addTodo',
        'click #clear-completed': 'clearCompleted',
        'change #hide-completed': 'toggleHide'
    },

    addTodoEnter: function(e){
        
        // Enter was pressed
        if (e.which === 13){
            this.addTodo();
        }

    },

    addTodo: function() {

        var text = $('#todo-add .todo-text').val();

        if (text !== ''){ 

            var thisTodo = new TodoModel({
                done: false,
                text: text
            });

            todos.unshift(thisTodo);
            
            thisTodo.save();

            this.$todoText.val("");
            this.$todoText.focus();
        }

    },

    clearCompleted: function() {

        var animateClear = _.bind(function(){

            var completed = todos.where({done: true});

            completed.forEach(function(todo){
                todo.trigger('trash');
            });

            notifications.createUndo(completed);

        }, this);

        if ($('#hide-completed').is(":checked")){
            $('#hide-completed').attr('checked', false);
            this.toggleHide();
            setTimeout(animateClear, 500); // hack, 500ms is how long it takes the hide animation
        }
        else {
            animateClear();
        }


    },

    toggleHide: function(){

        $('#todo-list').toggleClass('hide', $('#hide-completed').is(":checked"));

    }


}); // ApplicationView


new ApplicationView();


