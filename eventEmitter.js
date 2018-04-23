class EventEmitter {
  constructor() {
    this.events = {};
  }
  on(eventName, cb){
    if(this.events[eventName]){
      this.events[eventName] = [];
      this.events[eventName].push(cb)
    } else {
      this.events[eventName] = [cb];
    }
  }
  trigger(eventName, ...rest){
    if(this.events[eventName]){
      this.events[eventName].map(cb => {
          cb.apply(null, rest)
        });
    }
  }
  unsubscribe(eventName, cb){

  }
}
const ee = new EventEmitter();

    var todoModule = {
      options: {},
      init: function(settings){
        this.options = settings;
        this.attachEventListeners();
        this.addTodo();
      },
      attachEventListeners: function(){
        const _self = this;
        ee.on('todo_add', (d, id) => {
            let todo_li = document.createElement('li');
            todo_li.setAttribute('class', 'todo_element');
            todo_li.setAttribute('id', id)
            var html = `${d}<input type="checkbox" data-id="${id}" onChange="todoModule.checkTodo(this)"><button class="remove" onClick="todoModule.removeTodo(this)" data-id="${id}">remove</button>`
            todo_li.innerHTML = html;
            this.options.list.appendChild(todo_li)
            this.options.todo_elements += 1
        })
        ee.on('remove_todo', (id) => {
          let li = document.getElementById(id)
          li.parentNode.removeChild(li)
        })
        ee.on('check_todo', (id, check) => {
          let li = document.getElementById(id)
          check ? li.style.textDecoration = 'line-through' : li.style.textDecoration = 'none'
        })
      },
      addTodo: function(){
        this.options.button.addEventListener('click', () => {
          this.options.input.value.trim() != ""
            ? ee.trigger('todo_add', this.options.input.value, this.options.todo_elements)
            : null;
          this.options.input.value = ""
        });
      },
      removeTodo: function(el){
        ee.trigger('remove_todo', el.getAttribute('data-id'))
      },
      checkTodo: function(el){
        ee.trigger('check_todo', el.getAttribute('data-id'), el.checked)
      }
  }


todoModule.init({
  list: document.querySelector('.list'),
  button: document.querySelector('.addTodo'),
  input: document.querySelector('.todo_input'),
  todo_elements: document.querySelectorAll('.todo_element').length
});
