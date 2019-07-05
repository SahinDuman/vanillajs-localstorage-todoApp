const todo = document.querySelector('#todo');
const done = document.querySelector('#done');
const newTitle = document.querySelector('.new-note__form-title');
const newNote = document.querySelector('.new-note__form-note');


let stateObj = {
  sorting: true,
  notes: [],
};
const getStateObj = JSON.parse(localStorage.getItem('storeObj'));

function storeLocal() {
  localStorage.setItem('storeObj', JSON.stringify(stateObj));
}

function sorting() {
  stateObj.notes.sort((a, b) => {
    const dateA = new Date(a.stamp);
    const dateB = new Date(b.stamp);
    const result = (dateA - dateB);
    return (stateObj.sorting ? result * -1 : result);
  });
}

function createItems() {
  sorting();
  let pendingNotes = '';
  let doneNotes = '';

  stateObj.notes.forEach((e) => {
    const template = `
    <div id="${e.id}" class="${e.cardColor} item-card"> 
    <input class="check" type=checkbox name="check" ${e.checked}>
    <div>
    <h3 class="${e.checked} h3">${e.title}</h3>
    <p class="${e.checked} notes">${e.note}</p>
    <p class="timestamp">${e.stamp}</p>
    </div>
    <button type="submit" class="${e.delete}">X</button>
    </div>`;
    if (e.checked === 'checked') {
      doneNotes += template;
    } else {
      pendingNotes += template;
    }
  });
  todo.innerHTML = pendingNotes;
  done.innerHTML = doneNotes;
}

function newItem() {
  const date = new Date();
  const timeStamp = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

  const colorArray = ['pink-card', 'yellow-card', 'red-card', 'blue-card', 'green-card'];
  if (!newTitle.value && !newNote.value) {
    newTitle.style.borderColor = 'red';
    newTitle.placeholder = 'Please fill in atleast one input';
    newNote.style.borderColor = 'red';
    newNote.placeholder = 'Please fill in atleast one input';
  } else {
    const newObj = {
      title: newTitle.value,
      note: newNote.value,
      checked: '',
      id: Date.now(),
      stamp: timeStamp,
      cardColor: colorArray[Math.floor(Math.random() * colorArray.length)],
      delete: 'hide',
    };
    stateObj.notes.push(newObj);
  }
}

function checkedCard(id) {
  const rightNote = stateObj.notes.find(x => x.id.toString() === id);
  rightNote.checked = 'checked';
  rightNote.delete = 'delete';
  storeLocal();
  createItems();
}

function unCheckedCard(id) {
  const rightNote = stateObj.notes.find(x => x.id.toString() === id);
  rightNote.checked = '';
  rightNote.delete = 'hide';
  storeLocal();
  createItems();
}

function deleteCard(id) {
  const deleteIndex = stateObj.notes.findIndex((x => x.id.toString() === id));
  stateObj.notes.splice(deleteIndex, 1);
  storeLocal();
  createItems();
}

window.onload = () => {
  if (getStateObj) {
    stateObj = getStateObj;
  }
  createItems();
};

document.addEventListener('click', (e) => {
  if (e.target.matches('.delete')) {
    const { id } = e.target.parentNode;
    deleteCard(id);
  }

  if (e.target.matches('.check')) {
    const { id } = e.target.parentNode;
    if (e.target.checked) {
      checkedCard(id);
    } else {
      unCheckedCard(id);
    }
  }

  if (e.target.matches('.new-note__form-button')) {
    e.preventDefault();
    newItem(e);
    createItems();
    storeLocal();
    newTitle.value = '';
    newNote.value = '';
  }

  if (e.target.matches('#oldest')) {
    stateObj.sorting = false;
    storeLocal();
    createItems();
  }

  if (e.target.matches('#newest')) {
    stateObj.sorting = true;
    storeLocal();
    createItems();
  }
});
