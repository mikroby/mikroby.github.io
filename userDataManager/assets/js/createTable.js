'use strict';

import { mainTitle } from "./main.js";

// DOM constants.
const title = document.querySelector('.mainTitle');
const tHead = document.querySelector('.tableHeader');
const tBody = document.querySelector('.tableBody');
const editBtn =
  '<div class="btn edit--btn" title="edit"><i class="fas fa-marker"></i></i></div>';
const deleteBtn =
  '<div class="btn delete--btn" title="delete"><i class="far fa-trash-alt"></i></i></div>';
const saveBtn =
  '<div class="btn save--btn displayNone" title="save"><i class="far fa-check-circle"></i></i></div>';
const cancelBtn =
  '<div class="btn cancel--btn displayNone" title="cancel"><i class="far fa-times-circle"></i></div>';
// const addNewBtn = `<i class="fas fa-user-plus"></i>`;


// header order changeable in settings.json.
const createTableHeader = (dataObject) => {
  title.textContent = mainTitle;
  const { headers } = dataObject.settings;
  const coloums = headers.map(item => `<th class="${item[0]}">${item[1]}</th>`);
  const inputs = headers.map(item => item[0] !== 'id' ?
    `<th><input type="text" name="${item[0]}" placeholder="..." required></th>` : `<th></th>`);
  tHead.innerHTML = `<tr class="header--texts">${coloums.join('')}<th class="opt">Options</th></tr>
    <tr class="header--inputs">${inputs.join('')}
    <th><input type="submit" value="add new" class="input--btn"></th></tr>`;
}

// list accroding to header order.
const createTableContent = (dataObject) => {
  const users = dataObject.userData.users;
  const { headers } = dataObject.settings;

  tBody.innerHTML = '';

  // reverse order for last added user to appear on top.
  const rows = users.reverse().map(user => {
    const coloums = headers.map(header =>
      `<td class="${header[0]}">${user[header[0]]}</td>`);
    return `<tr>${coloums.join('')}<td class="opt">
      ${editBtn}${deleteBtn}${saveBtn}${cancelBtn}</td></tr>`;
  })

  tBody.innerHTML = rows.join('');
}

export { createTableHeader, createTableContent };