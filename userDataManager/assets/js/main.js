'use strict';

import { collectDatas, checkDatas } from "./collectDatas.js";
import { createTableHeader, createTableContent } from "./createTable.js";
import { btnClickHandlers } from "./eventHandling.js";

// main and file constants.
const mainTitle = 'User Data Manager';
const files = {
  URL: 'https://mikroby.github.io/userDataManager/db/',
  settingsJSON: 'db/sets.json',
  contentJSON: 'users'
};


const start=()=>{   
  collectDatas().then(checkDatas).then(dataObject => {
    createTableHeader(dataObject);
    createTableContent(dataObject);
    btnClickHandlers();
  });
}

start();

export { files, mainTitle, start };