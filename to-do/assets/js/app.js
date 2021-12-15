const appIdKey = 'to-do-manager';
const date = document.querySelector('.date');
const clock = document.querySelector('.clock');
const input = document.querySelector('.input');
const addTaskBtn = document.querySelector('.addTask--btn');
const completeTaskBtn = document.querySelector('.completeTask--btn');
const clearAllTaskBtn = document.querySelector('.clearAllTask--btn');
const pendingContainer = document.querySelector('.pending--container');
const completedContainer = document.querySelector('.completed--container');
const pendingMessage = document.querySelector('.pending--message');
const completedMessage = document.querySelector('.completed--message');
const pendingList = document.querySelector('.pending--list');
const completedList = document.querySelector('.completed--list');
const cheers = document.querySelector('.cheers');
const trashIcon = '<i class="fas fa-trash-alt"></i>';
const placeholder = 'Take the garbage out';
const dateFormatEng = {
  weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric'
};
const toggleDefault = ['Show Completed', 'Hide Completed'];
let toggle;


const showDate = () => {
  date.innerHTML = new Date()
    .toLocaleDateString('en-US', dateFormatEng).replace(/\//g, '-').replace(',', '<br>');
};

const showClock = () => {
  clock.textContent = new Date().toLocaleTimeString().padStart(8, '0');
  timing();
};

const timing = () => {
  let id = setTimeout(() => {
    clearTimeout(id);
    showClock()
  }, 1000);
};

function moveOut() {
  const child = this.children[2];
  child.classList.remove('move--in');
};

function moveIn() {
  const child = this.children[2];
  child.classList.add('move--in');
};

const addBtnEvents = () => {
  addTaskBtn.addEventListener('click', addNewPending);
  input.addEventListener('keydown', enterPressed);
  completeTaskBtn.addEventListener('click', toggleDisplay);
  clearAllTaskBtn.addEventListener('click', clearAllPending);
}

const setDefaultToggle = () => {
  toggle = [...toggleDefault];
  completeTaskBtn.textContent = toggle[0];
};

const createTag = (tag, className = '', type = '', content = '', innerHtml = '') => {
  const element = document.createElement(tag);
  if (className) { element.className = className; }
  if (type) { element.type = type; }
  if (content) { element.textContent = content; }
  if (innerHtml) { element.innerHTML = innerHtml; }
  return element;
};

const createItem = (task, listType) => {
  const item = createTag('div', 'item');
  const input = createTag('input', 'checkBox', 'checkbox');
  const content = createTag('span', 'task', '', task);
  const deleteBtn = createTag('div', 'btn delete--btn', '', '', trashIcon);

  item.appendChild(input);
  item.appendChild(content);
  item.appendChild(deleteBtn);

  item.addEventListener('mouseover', moveIn);
  item.addEventListener('mouseout', moveOut);

  deleteBtn.addEventListener('click', deleteClickedTask);

  if (listType === pendingList) {
    item.classList.add('pending');
    input.addEventListener('click', ClickedToCompleted);
  } else {
    item.classList.add('completed');
    input.setAttribute('checked', true);
    input.setAttribute('disabled', true);
  }

  return item;
};

const createList = (taskList, listType) => {
  taskList.forEach(task =>
    listType.appendChild(createItem(task, listType))
  );
};

const pushLocalStorage = (toStore) => {
  localStorage.setItem(appIdKey, JSON.stringify(toStore));
}

const getLocalStorage = () =>
  JSON.parse(localStorage.getItem(appIdKey));

const getOrCreateLocalStorageEntry = () => {
  const localEntry = getLocalStorage();
  const object = localEntry ? localEntry : { pending: [], completed: [] };
  if (!localEntry) {
    pushLocalStorage(object);
  }
  return object;
};

const toggleDisplay = () => {
  if (toggle[0] === toggleDefault[0]) {
    completedContainer.classList.remove('displayNone');
  } else {
    completedContainer.classList.add('displayNone');
  }
  [toggle[0], toggle[1]] = [toggle[1], toggle[0]];
  completeTaskBtn.textContent = toggle[0];
};

const showCheers = () => {
  pendingContainer.classList.add('displayNone');
  // completedContainer.classList.add('displayNone');
  cheers.classList.remove('displayNone');
};

const updateMessages = (pending, completed) => {
  pendingMessage.textContent = `You have ${pending.length} pending items`;
  const result = completed.length !== 0 ?
    `${Math.round(100 * completed.length / (completed.length + pending.length))}%`
    : 'no task yet.'
  completedMessage.textContent = `Completed tasks: ${result}`
};

const animate = (item, valueTo = '') =>
  new Promise(resolve => {
    if (valueTo !== '') { item.style.opacity = `${valueTo}` };
    const transitionEnded = event => {
      if (event.propertyName !== 'opacity') {
        return;
      }
      item.removeEventListener('transitionend', transitionEnded);
      resolve();
    }
    item.addEventListener('transitionend', transitionEnded);
  });

const enterPressed = (keyEvent) => {
  if (keyEvent.key !== 'Enter') { return }
  addNewPending();
}

const addNewPending = async () => {
  const task = input.value || placeholder;
  input.value = '';
  const newItem = createItem(task, pendingList);
  pendingList.insertAdjacentElement('afterbegin', newItem);
  // animation.
  newItem.style.opacity = 0;
  setTimeout(() => animate(newItem, 1), 0);
  updateLocalStorageEntry();
};

async function ClickedToCompleted() {
  const task = this.nextSibling.textContent;
  const parent = this.parentElement;
  // animation.
  await animate(parent, 0);
  parent.remove();
  const newItem = createItem(task, completedList);
  completedList.insertAdjacentElement('afterbegin', newItem);
  // animation.
  newItem.style.opacity = 0;
  setTimeout(() => animate(newItem, 1), 0);
  updateLocalStorageEntry();
};

async function deleteClickedTask() {
  const task = this.previousSibling.textContent;
  const parent = this.parentElement;
  // animation.
  await animate(parent, 0);
  parent.remove();
  updateLocalStorageEntry();
}

const clearAllPending = () => {
  while (pendingList.childElementCount) {
    pendingList.lastElementChild.remove();
  }
  updateLocalStorageEntry();
};

const checkPending = (pending) => {
  if (pending.length === 0) {
    // setDefaultToggle();
    showCheers();
  } else {
    cheers.classList.add('displayNone');
    pendingContainer.classList.remove('displayNone');
  }
};

const updateLocalStorageEntry = () => {
  const pending = Array.from(document.querySelectorAll('[class^="item pending"] .task'))
    .map(item => item.textContent);
  const completed = Array.from(document.querySelectorAll('[class^="item completed"] .task'))
    .map(item => item.textContent);
  pushLocalStorage({ pending, completed });
  updateMessages(pending, completed);
  checkPending(pending);
};


// IIFE starter.
(() => {
  showDate();
  showClock();
  const { pending, completed } = getOrCreateLocalStorageEntry();
  checkPending(pending);
  createList(pending, pendingList);
  createList(completed, completedList);
  updateMessages(pending, completed);
  setDefaultToggle();
  addBtnEvents();
})();
