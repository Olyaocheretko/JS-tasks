/*
ДЗ 11
   Напишите код, который будет выводить на страницу список дел для 3-х пользователей.
   Для получения данных о пользователях, вам необходимо написать функцию, которая будет делать GET-запрос
   на эндпоинт https://jsonplaceholder.typicode.com/todos.
   Функция должна делать запрос с использованием XMLHttpRequest вызываться при загрузке страницы.
   В функции реализуйте следующую логику:
   -Укажите тип ожидаемого ответа, с помощью свойства responseType.
   -Добавьте обработчики для load и error и выводите в консоль сообщение о них.
   В обработчике для load сделайте проверку статуса используя свойство status или statusText.
   Если статус ответа положительный, выведите в консоль сообщение об успешном получении ответа. Если нет, выведите сообщение об ошибке.
   -Для сохранения полученных данных добавьте обработчик на событие onreadystatechange. В обработчике реализуйте проверку свойства readyState.
   Выполните присваивание только в случаи полной загрузки ответа сервера.
   -Добавьте заголовок ‘Content-Type’ со значением ‘application/json’ перед отправкой запроса.
   -После получения данных с сервера, вам нужно отфильтровать полученный массив и оставить только те элементы, которые принадлежат пользователям с id 2, 4 и 6.
   -Получившийся массив преобразовать в массив с массивами, в котором элементы для каждого пользователя буду находится в отдельном массиве (должен получится массив с 3-мя массивами).
   Оставьте в массиве для каждого пользователя только 5 элементов.
   -Написать функцию, которая будет динамически создавать блок разметки, с использованием JS, для отображения списка дел пользователя.
   -В блоке должен быть заголовок с текстом ‘To-Do list for user №${id пользователя}’ и нумерованный список.
   Дела пользователя должны выводится в цикле, и каждая итерация цикла должна добавлять элемент в нумерованный список.
   Каждый элемент нумерованного списка должен содержать input. Задайте элементу input свойство disabled – true и в качестве значения укажите поле title объекта, который вы выводите.
   -Для создания и добавления элементов на страницу используйте только JS. Стили добавьте на своё усмотрение.
ДЗ 12.3
  Добавить в решение домашнего задания №11 следующий функционал (Все элементы добавлять динамически с использованием JS.
  В body index.html должен быть только тег script):
  В блок каждого пользователя, под заголовком ‘To-Do list for user №${id пользователя}’, добавить кнопку с тестом ‘Add new Item’.
  Под кнопкой ‘Add new Item’ для каждого пользователя, добавить блок для добавления нового элемента списка.
  Блок должен содержать textarea и button с текстом ‘Add’.
  Блок для добавления нового элемента списка должен быть скрыт изначально.
  Добавьте обработчик клика на кнопку ‘Add new Item’ и показывайте/скрывайте блок по нажатию на кнопку.
  Для каждого элемента списка дел добавьте 2 кнопки: ‘Remove’ и ‘Edit’
  На кнопку ‘Edit’ добавьте обработчик события ‘клик’. Функция-обработчик должна изменять значение свойства disabled на false у инпута элемента,
  на котором произошло нажатие, и делать активным инпут того элемента.
  Стили добавьте на своё усмотрение. (Стили можно добавлять в css-файле)
*/

const url = 'https://jsonplaceholder.typicode.com/todos'
const requiredUserIds = [2, 4, 6]
const requiredToDoListItems = 5

window.onload = function() {
  showToDoList(url)
}

function showToDoList(url) {
  const getRequest = new XMLHttpRequest
  getRequest.open('GET',url)
  getRequest.setRequestHeader('Content-Type', 'application/json')
  getRequest.responseType = 'json'
  getRequest.send()

  getRequest.onload = function(event) {
    let message = event.target.status >= 300 ? `Something went wrong` : 'Your request has been loaded'
    console.log(message)
  }
  getRequest.onerror = function(event) {
    console.log (`Something went wrong. Status is: ${this.status}`)
  }
  getRequest.onreadystatechange = function(event) {
    if(event.target.readyState === 4) {
      let toDoList = this.response

      let filteredToDoList = getFilteredArray(toDoList, requiredUserIds, requiredToDoListItems)
      renderToDoList(filteredToDoList)
    }
  }
}

function getFilteredArray(toDoList, requiredUserIds, requiredToDoListItems) {
  let filteredArrayOfUsers = []
  for(let i = 0; i < requiredUserIds.length; i++) {
    filteredArrayOfUsers.push(toDoList.filter(item => item.userId === requiredUserIds[i]).slice(0,requiredToDoListItems))
  }

  return filteredArrayOfUsers
}

function renderToDoList(filteredArray) {
  let container = document.createElement('div')
  document.body.append(container)
  container.className = `container`

  filteredArray.forEach(function (userGroup) {
    let userId = userGroup[0].userId

    let toDoBlock = document.createElement('form')
    toDoBlock.className = `list`
    toDoBlock.innerHTML = `
      <h2 class="list__title">To-Do list for user № ${userId}</h2>
      <a href="#" class="list__button btn">Add new Item</a>
      <div class="list__row list__row-new">
        <textarea class="list__input list__column" autocomplete="off"></textarea>
        <button type="submit" class="list__button-small btn list__column">Add</button>
      </div>
      <ol class='list__body list__body-${userId}'></ol>
    `
    container.append(toDoBlock)

    for (let i = 0; i < userGroup.length; i++) {
      let olItem = document.querySelector(`.list__body-${userId}`)

      let liLast = document.createElement('li')
      liLast.className = 'list__row'
      liLast.innerHTML = `
        <input type="text" disabled="disabled" class="list__input list__column" value="${userGroup[i].title}">
        <div class="list__buttons list__column">
            <a href="#" class="list__button list__button-med btn _btn-remove">Remove</a>
            <a href="#" class="list__button list__button-med btn _btn-edit">Edit</a>
        </div>
      `
      olItem.append(liLast)
    }

    showNewItemBlock()
  })
}

function showNewItemBlock() {
  const buttons = document.querySelectorAll('.list__button')

  buttons.forEach (function (button) {
    for (let index = 0; index < buttons.length; index++) {
      let button = buttons[index]

      button.onclick = function(event) {
        event.preventDefault();
        this.nextElementSibling.classList.toggle('_active')
      }
    }
  })
}
