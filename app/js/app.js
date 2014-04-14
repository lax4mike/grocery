
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
        this.listenTo(notifications, "add", this.renderOneNotification);

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

        var animateClear = function(){

            var completed = todos.where({done: true});

            completed.forEach(function(todo){
                todo.trigger('trash');
            });
        }

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
        this.listenTo(todoView, "trashed", function(e){

            var undoModel = new NotificationModel({
                text: todoView.model.get('text') + " deleted.",
                buttonText: "undo",
                todoView: todoView
            });
            notifications.add(undoModel);

        });

        this.$list.prepend(todoView.$el);

        // hack to make it look collapsed
        setTimeout(function(){
            todoView.$el.removeClass('collapsed');
        }, 0);
        
    },

    renderOneNotification: function(model) {

        var undoView = new NotificationView({model: model});
        undoView.render();

        // on button click, undo item trash
        this.listenTo(undoView, 'buttonClick', function(e){
            var todoModel = undoView.model.get('todoView').model;
            todoModel.unset('_id'); // undo id so backbone thinks it needs to POST (create) instead of PUT (update)
            todos.add(todoModel);
            todoModel.save(); 
        });

        this.$notifications.prepend(undoView.$el);

        setTimeout(function(){
            undoView.trash();
        }, 10000);
    }

}); // ApplicationView


new ApplicationView();


