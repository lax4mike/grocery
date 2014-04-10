
var $ = require('jquery'); 
var _ = require('underscore');
var Backbone = require('backbone'); 
Backbone.$ = $;


var TodoCollection = require('./todo/TodoCollection.js');
var TodoModel = require('./todo/TodoModel.js');
var TodoView = require('./todo/TodoView.js');

var todos = new TodoCollection();


var ApplicationView = Backbone.View.extend({

    el: 'body',

    initialize: function() {

        this.$todoText = $('#todo-add .todo-text');
        this.$list = $('#todo-list');

        this.listenTo(todos, "add", this.renderOne);

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


    renderOne: function(model) {
        
        var view = new TodoView({model: model});
        view.render()
        view.$el.addClass('collapsed');

        this.$list.prepend(view.$el);

        setTimeout(function(){
            view.$el.removeClass('collapsed');
        }, 0);
        
    }

}); // ApplicationView


new ApplicationView();


