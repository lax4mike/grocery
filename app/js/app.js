
var $ = require('./jquery.js'); 
var _ = require('./underscore.js');
var Backbone = require('./backbone.js'); 
Backbone.$ = $;


// Todo Model
var TodoModel = Backbone.Model.extend({

    defaults: {
        text: '',
        done: false
    },

    idAttribute: "_id"

});

// Todo Collection
var TodoCollection = Backbone.Collection.extend({

    model: TodoModel,

    url: "/items/"

}); 

// Todo View
var TodoView = Backbone.View.extend({

    tagName:  'li',

    initialize: function(){

        this.listenTo(this.model, 'trash', this.trashTodo);

    },

    template: _.template($('#todo-item-template').html()),

    events: {
        'change input[type=checkbox]': 'toggleCheckbox',
        'click .remove': 'trashTodo',
    },

    toggleCheckbox: function(e){
        var checked = this.$el.find('input[type=checkbox]').is(':checked');
        this.$el.toggleClass("checked", checked);
        this.model.set("done", checked);
        this.model.save();
    },

    // animation
    trashTodo: function(){
        this.$el.addClass('trash');

        var transitions = 0;

        this.$el.on("transitionend webkitTransitionEnd OTransitionEnd", _.bind(function(){ 
            // this animation is 2 transitions (left, height)
            if (++transitions >= 2){
                this.removeTodo();
            }
        }, this));
    },

    removeTodo: function(e) {

        this.model.destroy();
        this.remove();
    },

    render: function() {
        this.$el.html(this.template(this.model.attributes));
        this.toggleCheckbox();
        return this;
    },

});

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


