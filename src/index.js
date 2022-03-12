import { v4 as uuidv4 } from 'uuid';
import {
  todoFormDetailedTemplate,
  renderChecklistItem,
  renderDropdownValues,
  resetDOM,
  updateLocalStorageTodos,
  updateLocalStorageCategories,
} from './modules/functions';

// const
const todos = [];
const categories = ['Private', 'Work'];
const priorities = ['! Low', '!! Medium', '!!! High'];

// class todo
class Todo {
  // constructor
  constructor(name, id, category, completed, notes, priority, dueDate) {
    this.name = name;
    this.id = id;
    this.category = category;
    this.completed = completed ? true : false;
    this.notes = notes ? notes : '';
    this.priority = priority ? priority : '';
    this.dueDate = dueDate ? dueDate : '';
  }

  // get name
  getName() {
    return this.name;
  }

  // get notes
  getNotes() {
    return this.notes;
  }

  // get due date
  getDueDate() {
    return this.dueDate;
  }
}

// const 
const addTodoToList = (todo) => {
  todos.push(todo);
};

// const
const createTodo = (todo, id, category) => {
  return new Todo(todo, id, category);
};

// const
const resetTodoForm = () => {
  document.getElementById('todoInputSimple').value = '';
};

// const
const addCategory = (category) => {
  // push & update categories
  categories.push(category);
  updateLocalStorageCategories(categories);
};

//  const category
const categoryFormListener = (() => {
  // const add to category form
  const categoryForm = document.getElementById('add-category');
  // category form event listeners
  categoryForm.addEventListener('submit', (e) => {
    // prevent default
    e.preventDefault();
    // const category - get id element & trim value
    const category = document.getElementById('add-category-input').value.trim();
    // if-else method - add & render category
    if (category.length > 0) {
      // add and render category
      addCategory(category);
      renderCategories();
      // assign value - id
      document.getElementById('add-category-input').value = '';
    }
  });
})();

// const
const renderCategories = () => {
  // const category list - get id element
  const categoryList = document.getElementById('categories-list');
  // category list inner html
  categoryList.innerHTML = '';
  // categories - const create element
  categories.forEach((category) => {
    // const
    const element = document.createElement('a');
    const span = document.createElement('span');
    const button = document.createElement('button');
    // set attribute
    element.setAttribute('href', `#${category}`);
    // add event listener
    element.addEventListener('click', (e) => {
      // sidebar toggle
      toggleSidebar();
    });
    // add class
    element.classList.add('item');
    // inner text assign to category
    span.innerText = category;
    // button add class
    button.classList.add('ui', 'icon', 'grey', 'button');
    // button set attribute
    button.setAttribute('id', `delete-category-button-${category}`);
    // button inner html
    button.innerHTML = `<i class="delete icon"></i>`;

    // butotn onclick function
    button.onclick = function () {
      deleteCategory(category);
    };
    // element append child
    element.appendChild(span);
    element.appendChild(button);
    // category list append element
    categoryList.appendChild(element);
  });
};
// render categories
renderCategories();

// const toggle sidebar
const toggleSidebar = () => {
  // media query - 992px
  const mediaQuery = window.matchMedia('(max-width: 992px)');
  if (mediaQuery.matches) {
    // toggle ui sidebar
    $('.ui.sidebar').sidebar('toggle');
  }
};

// const delete category
const deleteCategory = (category) => {
  // const index
  const index = categories.findIndex((x) => x === category);
  // categories splice
  categories.splice(index, 1);
  // render categories
  renderCategories();
  // update local storage - categories
  updateLocalStorageCategories(categories);
};

// add event listener 
window.addEventListener('hashchange', () => {
  // window location hash
  if (window.location.hash) {
    // hash - variable, remove #
    const hash = window.location.hash.substring(1);
    // get element page title - hash inner text
    document.getElementById('page-title').innerText = hash;
    // render todos
    renderTodos(todos);
  }
});

// const form listener
const simpleFormListener = (() => {
  // const todo form simple
  const todoFormSimple = document.getElementById('todoFormSimple');
  todoFormSimple.addEventListener('submit', (e) => {
    // prevent default
    e.preventDefault();
    // const todo - id - trim value
    const todo = document.getElementById('todoInputSimple').value.trim();
    // if length - new todo controller
    if (todo.length > 0) {
      newTodoController(todo);
    }
  });
})();

// const render todos
const renderTodos = (todos) => {
  // reset dom
  resetDOM();
  // check category & filter
  if (window.location.hash) {
    // const hash
    const hash = window.location.hash.substring(1);
    // const filtered todos
    const filteredTodos = todos.filter((todo) => todo.category === hash);
    // filter todos length
    if (filteredTodos.length < 1) {
      // const element p
      const element = document.createElement('p');
      // inner text
      element.innerText = '— Add new task';
      // get todolist - id 
      document.getElementById('todoList').appendChild(element);
    }
    // filtered todos
    filteredTodos.forEach((todo) => {
      // render checklist todos
      renderChecklistItem(todos, todo);
      // render detailed form todo
      renderDetailedForm(todo);
    });
  } else {
    // const filter todo - private
    const defaultTodos = todos.filter((todo) => todo.category === 'Private');
    // todos default length
    if (defaultTodos.length < 1) {
      // const create element p
      const element = document.createElement('p');
      // element inner text
      element.innerText = '— Add new task';
      // get element - id 
      document.getElementById('todoList').appendChild(element);
    }
    // default todos
    defaultTodos.forEach((todo) => {
      // render checklist todos
      renderChecklistItem(todos, todo);
      // render detailed form todo
      renderDetailedForm(todo);
    });
  }
};
// render todos
renderTodos(todos);

// const todo controller
const newTodoController = (todo) => {
  // let
  let category = 'Private';
  // if-else window location hash
  if (window.location.hash) {
    // const hash
    const hash = window.location.hash.substring(1);
    // category hash
    category = hash;
  }
  // const new todo
  const newTodo = createTodo(todo, uuidv4(), category);
  // add todo to list
  addTodoToList(newTodo);
  // render todos
  renderTodos(todos);
  // reset todo form
  resetTodoForm();
  // update local storage todos
  updateLocalStorageTodos(todos);
};

// const update controller
const todoUpdateController = (
  // attributes
  id,
  name,
  notes,
  category,
  priority,
  dueDate,
  status
) => {
  // const todos find id
  const todo = todos.find((todo) => todo.id === id);
  // attributes
  todo.name = name;
  todo.notes = notes;
  todo.category = category;
  todo.priority = priority;
  todo.completed = status;
  todo.dueDate = dueDate;
  renderTodos(todos);
  updateLocalStorageTodos(todos);
};

// render detailed form and enable logic
const renderDetailedForm = (todo) => {
  // const button more
  const moreButton = document.getElementById(`more-button-${todo.id}`);
  // add event listener - click
  moreButton.addEventListener('click', (e) => {
    // get element id form
    const todoForm = document.getElementById(`form-${todo.id}`);
    // button set attribute
    moreButton.setAttribute('style', 'display:none');
    // todo form inner html - form detailed template
    todoForm.innerHTML = todoFormDetailedTemplate(todo);

    // dropdown categories
    $(`#category-dropdown-${todo.id}`).dropdown({
      values: renderDropdownValues(categories, todo.category),
    });
    // dropdown priorities
    $(`#priority-dropdown-${todo.id}`).dropdown({
      values: renderDropdownValues(priorities, todo.priority),
    });
    // dropdown status
    $(`#status-dropdown-${todo.id}`).dropdown({
      // values
      values: [
        {
          name: 'Completed',
          value: 'true',
          selected: todo.completed === false ? false : true,
        },
        {
          name: 'Not Completed',
          value: 'false',
          selected: todo.completed === false ? true : false,
        },
      ],
    });

    // get element id delete button
    document
      .getElementById(`delete-button-${todo.id}`)
      // add event listener - click
      .addEventListener('click', (e) => {
        // prevent default
        e.preventDefault();
        // const index find x todo id
        const index = todos.findIndex((x) => x.id === todo.id);
        // splice todos
        todos.splice(index, 1);
        // render todos
        renderTodos(todos);
        // update local storage - todos
        updateLocalStorageTodos(todos);
      });

    //event listener for form submission
    document
      .getElementById(`detailed-form-${todo.id}`)
      // add evenet listener - submit
      .addEventListener('submit', (e) => {
        // prevent default
        e.preventDefault();
        // const name, notes, category
        const name = document.getElementById(`name-${todo.id}`).value;
        const notes = document.getElementById(`notes-${todo.id}`).value;
        const category = $(`#category-dropdown-${todo.id}`).dropdown(
          // get value
          'get value'
        );
        const priority = $(`#priority-dropdown-${todo.id}`).dropdown(
          // get value
          'get value'
        );
        const status =
          // status dropdown - get value
          $(`#status-dropdown-${todo.id}`).dropdown('get value') === 'true'
            ? true
            : false;
        // const due date
        const dueDate = document.getElementById(`dueDate-${todo.id}`).value;
        todoUpdateController(
          // attributes
          todo.id,
          name,
          notes,
          category,
          priority,
          dueDate,
          status
        );
      });
  });
};

//open menu
document.getElementById('sidebar-menu-button')
  // add event listener - click
  .addEventListener('click', (e) => {
    // ui sidebar toggle
    $('.ui.sidebar').sidebar('toggle');
  });

// media query for fixed menu on desktop
const renderDesktopView = () => {
  // query select sidebar visible
  document.querySelector('.sidebar').classList.add('visible');
  // nav display none
  $('.nav').parent().css('display', 'none');
};

// const media query - 992px
const mediaQuery = window.matchMedia('(min-width: 992px)');
// media query check
if (mediaQuery.matches) {
  // render desktop view
  renderDesktopView();
}

// media query add event listener change
mediaQuery.addEventListener('change', (e) => {
  // check if match - e
  if (e.matches) {
    // render desktop view
    renderDesktopView();
  } else {
    // remove class from sidebar
    $('.sidebar').removeClass('visible');
    // remove class from nav
    $('.nav').parent().css('display', 'block');
  }
});

// window local storage get todos
if (window.localStorage.getItem('todos')) {
  // const local storage todos
  const localStorageTodos = JSON.parse(window.localStorage.getItem('todos'));
  // length 
  todos.length = 0;
  // local storage
  localStorageTodos.forEach((todo) => {
    // push todos
    todos.push(
      // new todo
      new Todo(
        // attributes
        todo.name,
        todo.id,
        todo.category,
        todo.completed,
        todo.notes,
        todo.priority,
        todo.dueDate
      )
    );
  });
  // render todos
  renderTodos(todos);
}

// get categories
if (window.localStorage.getItem('categories')) {
  // const local storage categories - parse json
  const localStorageCategories = JSON.parse(
    // get local storage item categories
    window.localStorage.getItem('categories')
  );
  // categories length
  categories.length = 0;
  localStorageCategories.forEach((category) => {
    // push categories
    categories.push(category);
  });
  // render categories
  renderCategories();
}