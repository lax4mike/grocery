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

var io = require('socket.io-client');
var socket = io.connect('//' + window.location.hostname + ":3000");

Backbone.socket = socket;
Backbone.sync = require('./sync.js');


var ApplicationView = Backbone.View.extend({

    el: 'body',

    todos: todos,

    initialize: function() {

        this.$todoText = $('#todo-add .todo-text');
        this.$list = $('#todo-list');

        this.todos.fetch();

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

            this.saveTodo({
                done: false,
                text: text
            });

            this.$todoText.val("");
            this.$todoText.focus();
        }

    },

    saveTodo: function(todoObject){

        var thisTodo = new TodoModel(todoObject);

        this.todos.unshift(thisTodo);

        thisTodo.save();
    },

    deleteTodoById: function(id){
        var todo = this.todos.get(id);
        if (todo){
            todo.trigger('trash');
        } 
    },

    updateItemByObject: function(obj){

        var todo = this.todos.get(obj._id);
        todo.set(obj);

        // todo.save(); // this will cause an infinate loop
    },

    clearCompleted: function() {

        var animateClear = _.bind(function(){

            var completed = this.todos.where({done: true});

            completed.forEach(function(todo){
                todo.trigger('trash');
            });

            setTimeout(function(){
                notifications.createUndo(completed);    
            }, 1000);
            

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


var app = new ApplicationView();


require('./socket.js')(app);



