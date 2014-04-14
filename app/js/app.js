
var $ = require('jquery'); 
var _ = require('underscore');
var Backbone = require('backbone'); 
Backbone.$ = $;

var TodoCollection = require('./todo/TodoCollection.js');
var TodoModel = require('./todo/TodoModel.js');
var TodoView = require('./todo/TodoView.js');

var NotificationCollection = require('./notification/NotificationCollection.js');
var NotificationView = require('./notification/NotificationView.js');
var NotificationModel = require('./notification/NotificationModel.js');

var todos = new TodoCollection();
var notifications = new NotificationCollection();

var ApplicationView = Backbone.View.extend({

    el: 'body',

    initialize: function() {

        this.$todoText = $('#todo-add .todo-text');
        this.$list = $('#todo-list');
        this.$notifications = $('#notifications');

        this.listenTo(todos, "add", this.renderOneItem);
        this.listenTo(notifications, "add", this.renderUndoNotification);

        todos.fetch();

        // var undoModel = new NotificationModel({
        //     text: "POOP deleted."
        // });
        // notifications.add(undoModel);

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

            this.createUndo(completed);
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

    },

    renderOneItem: function(model) {
        
        var todoView = new TodoView({model: model});
        todoView.render();
        todoView.$el.addClass('collapsed');

        // show undo notification if this item is trashed
        this.listenTo(todoView, "removeClicked", function(e){
            this.createUndo([todoView.model]);
        });

        this.$list.prepend(todoView.$el);

        // hack to make it look collapsed
        setTimeout(function(){
            todoView.$el.removeClass('collapsed');
        }, 0);
        
    },

    // given an array of TodoModels, create the undo notification
    createUndo: function(undoTodos){

        var text = (undoTodos.length == 1) ? 
            undoTodos[0].get('text') : 
            undoTodos.length + " items";
        text += " deleted";

        var undoModel = new NotificationModel({
            text: text,
            buttonText: "undo",
            todos: undoTodos
        });
        notifications.add(undoModel);

    },

    renderUndoNotification: function(model) {

        var undoView = new NotificationView({model: model});
        undoView.render();

        // on button click, undo item trash
        this.listenTo(undoView, 'buttonClick', function(e){
            var undoTodos = undoView.model.get('todos');

            undoTodos.forEach(function(model){ 
                model.unset('_id'); // undo id so backbone thinks it needs to POST (create) instead of PUT (update)
                todos.add(model);
                model.save(); 
            })
            
        });

        this.$notifications.prepend(undoView.$el);

        setTimeout(function(){
            undoView.trash();
        }, 10000);
    }

}); // ApplicationView


new ApplicationView();


