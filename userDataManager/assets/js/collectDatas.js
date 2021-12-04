'use strict';

import { readData } from "./crud.js";
import { files } from "./main.js";
import setModal from "./modal.js";


const collectDatas = async () => {
  const settings = await readData(files.settingsJSON);
  const userData = await readData(files.URL, files.contentJSON);
  return { settings, userData };
};

const checkDatas = (dataObject) => {
  const { settings, userData } = dataObject;
  if (settings.length === 0) {
    alert('sets.json file is empty or missing!');
    return;
  }
  if (userData.length === 0) {
    setModal('jsonFileError', 5000);
    return;
  }
  return dataObject;
};

export { collectDatas, checkDatas };