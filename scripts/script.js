const modal = document.querySelector("#create-modal");
const openFormButton = document.querySelector("#open-form-button");
const cancelFormButton = document.querySelector("#cancel-form-button");

// Форма создания задачи
const createForm = document.querySelector("#create-form");
const todoList = document.querySelector("#todo-list");

// Поле поиска
const searchInput = document.querySelector("#search-input");

//   кнопки фильтрации задач
const filterAllButton = document.querySelector("#filter-all");
const filterActiveButton = document.querySelector("#filter-active");
const filterDoneButton = document.querySelector("#filter-done");

const filterButtons = document.querySelectorAll(".split-button__button");

// задачи из localStorage
const todos = JSON.parse(localStorage.getItem("todos")) || [
  {
    description: "Покормить кошку",
    date: "2026-01-10T11:30",
    completed: true,
  },
  {
    description: "Покормить кошку",
    date: "2026-01-10T11:30",
    completed: false,
  },
  {
    description: "Покормить кошку",
    date: "2026-01-10T11:30",
    completed: false,
  },
  {
    description: "Покормить кошку",
    date: "2026-01-10T11:30",
    completed: false,
  },
];

// по умолчанию все задачи
let currentFilter = "all";

// форма добавления
openFormButton.addEventListener("click", () => {
  modal.classList.add("modal--open");
});

// Очистка полей
cancelFormButton.addEventListener("click", () => {
  modal.classList.remove("modal--open");

  createForm.reset();
});

// новая задача
createForm.addEventListener("submit", (event) => {
  event.preventDefault();

  // данные из формы
  const description = event.target.elements.description.value;
  const startDate = event.target.elements.startDate.value;

  // новая задача
  const newTodo = {
    description: description,
    date: startDate,
    completed: false,
  };

  todos.push(newTodo);

  saveTodos();

  createForm.reset();

  modal.classList.remove("modal--open");

  renderTodos();
});

// Показываем все задачи
filterAllButton.addEventListener("click", () => {
  currentFilter = "all";

  setActiveFilter(filterAllButton);

  renderTodos();
});

// только активные задачи
filterActiveButton.addEventListener("click", () => {
  currentFilter = "active";

  setActiveFilter(filterActiveButton);

  renderTodos();
});

//    только завершённые задачи
filterDoneButton.addEventListener("click", () => {
  currentFilter = "done";

  setActiveFilter(filterDoneButton);

  renderTodos();
});

searchInput.addEventListener("input", () => {
  renderTodos();
});

// Переключатель состояния кнопок
function setActiveFilter(activeButton) {
  filterButtons.forEach((button) => {
    button.classList.remove("split-button__button--active");
  });

  activeButton.classList.add("split-button__button--active");
}

function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

//  перерисовка списка
function renderTodos() {
  todoList.innerHTML = "";

  let filteredTodos = todos;

  // активные задачи
  if (currentFilter === "active") {
    filteredTodos = todos.filter((todo) => {
      return todo.completed === false;
    });
  }

  // завершённые задачи
  if (currentFilter === "done") {
    filteredTodos = todos.filter((todo) => {
      return todo.completed === true;
    });
  }

  // текст поиска
  const searchValue = searchInput.value.toLowerCase();

  filteredTodos = filteredTodos.filter((todo) => {
    return todo.description.toLowerCase().includes(searchValue);
  });

  //    карточки задач
  filteredTodos.forEach((todo) => {
    const todoItem = document.createElement("li");

    todoItem.className = "todo-block";

    const checkboxLabel = document.createElement("label");

    checkboxLabel.className = "checkbox";

    const checkbox = document.createElement("input");

    checkbox.type = "checkbox";
    checkbox.checked = todo.completed;

    const checkIcon = document.createElement("span");

    checkIcon.className = "material-symbols-rounded checkbox__check-icon";

    checkIcon.textContent = "check";

    checkboxLabel.append(checkbox, checkIcon);

    // дата и описание
    const todoData = document.createElement("div");

    todoData.className = "todo-block__data";

    const todoDate = document.createElement("p");

    todoDate.className = "todo-block__date";
    todoDate.textContent = formatDate(todo.date);

    const todoTitle = document.createElement("h2");

    todoTitle.className = "todo-block__title";
    todoTitle.textContent = todo.description;

    todoData.append(todoDate, todoTitle);

    todoItem.append(checkboxLabel, todoData);

    todoList.append(todoItem);

    checkbox.addEventListener("change", () => {
      todo.completed = checkbox.checked;

      saveTodos();

      renderTodos();
    });
  });
}

// Приводим дату к понятному виду
function formatDate(dateValue) {
  const date = new Date(dateValue);

  return date.toLocaleString("ru-RU", {
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });
}

renderTodos();
