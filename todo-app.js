(function () {
  let todoArray = []

  function findID(idEl){
    for (let i = 0; i !== todoArray.length; ++i){
      if (Number(todoArray[i].id) === Number(idEl)){
        todoArray[i].done = !todoArray[i].done
        break
      }
    }
  }

  function deleteID(idEl){
    todoArray = todoArray.filter(el => Number(el.id) !== Number(idEl))
  }

  function createID(){
    if (todoArray.length > 0){
      return Number(todoArray[todoArray.length - 1].id) + 1
    }
    return 1
  }

  function createAppTitle(title) {
    let appTitle = document.createElement("h2")
    appTitle.innerHTML = title
    return appTitle
  }

  function createTodoItemForm() {
    let form = document.createElement('form')
    let input = document.createElement('input')
    let buttonWrapper = document.createElement('div')
    let button = document.createElement('button')

    form.classList.add('input-group', 'mb-3')
    input.classList.add('form-control')
    input.placeholder = 'Enter the new name of todo'
    buttonWrapper.classList.add('input-group-append')
    button.classList.add('btn', 'btn-primary')
    button.textContent = 'Add todo'
    button.disabled = true

    input.oninput = () => {
      button.disabled = !input.value;
    }

    buttonWrapper.append(button)
    form.append(input)
    form.append(buttonWrapper)

    return [form, input, button]
  }

  function createTodoList() {
    let list = document.createElement('ul')
    list.classList.add('list-group')
    return list
  }

  function createTodoItem(name, done = false, idLocal = 0, check = true) {
    let idEl = idLocal ? idLocal : createID()
    let item = document.createElement('li')

    let buttonGroup = document.createElement('div')
    let doneButton = document.createElement('button')
    let deleteButton = document.createElement('button')

    item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center', done ? 'list-group-item-success' : null)
    item.textContent = name

    buttonGroup.classList.add('btn-group', 'btn-group-sm')
    doneButton.classList.add('btn', 'btn-success')
    doneButton.textContent = 'Done'
    deleteButton.classList.add('btn', 'btn-danger')
    deleteButton.textContent = 'Delete'
    item.id = idEl
    doneButton.id = idEl
    deleteButton.id = idEl

    if (check) {
      todoArray.push({name: name, done: done, id: idEl})
    }

    buttonGroup.append(doneButton)
    buttonGroup.append(deleteButton)
    item.append(buttonGroup)

    return [item, doneButton, deleteButton]
  }

  function addTodo(todoItem, todoDoneButton, todoDeleteButton, todoList, key){
    todoDoneButton.addEventListener('click', function () {
      todoItem.classList.toggle('list-group-item-success')
      findID(todoDoneButton.id)
      localStorage.setItem(key, JSON.stringify(todoArray))
    })
    todoDeleteButton.addEventListener('click', function () {
      if (confirm('Are you sure?')) {
        todoItem.remove()
        deleteID(todoDeleteButton.id)
        localStorage.setItem(key, JSON.stringify(todoArray))
      }
    })

    todoList.append(todoItem)
  }

  function createTodoApp(container, key, title){
    let todoAppTitle = createAppTitle(title)
    let [form, input, button] = createTodoItemForm()
    let todoList = createTodoList()

    container.append(todoAppTitle)
    container.append(form)
    container.append(todoList)

    if (localStorage.getItem(key)) {
      let array = JSON.parse(localStorage.getItem(key))
      for (let i = 0; i !== array.length; ++i) {
        todoArray.push(array[i])
      }
    }

    for (let i = 0; i < todoArray.length; ++i){
      let [todoItem, todoDoneButton, todoDeleteButton] = createTodoItem(todoArray[i].name, todoArray[i].done, todoArray[i].id, false)
      addTodo(todoItem, todoDoneButton, todoDeleteButton, todoList, key)
    }
    form.addEventListener('submit', function (e) {
      e.preventDefault()

      let [todoItem, todoDoneButton, todoDeleteButton] = createTodoItem(input.value)

      localStorage.setItem(key, JSON.stringify(todoArray))
      addTodo(todoItem, todoDoneButton, todoDeleteButton, todoList, key)

      input.value = ''

      button.disabled = true
    })

  }

  window.createTodoApp = createTodoApp;
})()
