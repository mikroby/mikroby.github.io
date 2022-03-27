'use strict';

import { readData } from "./crud.js";
import { files } from "./main.js";
import setModal from "./modal.js";


const collectDatas = async () => {
  const settings = await readData(files.URL, files.settingsJSON);
  const userData = await readData(files.URL, files.contentJSON);

  return { settings, userData };
};

const checkDatas = (dataObject) => {
  const { settings, userData } = dataObject;
  const numberOfEntries = Object.keys(settings).length

  switch (numberOfEntries) {
    case 0:
      alert('sets.json file is empty or missing!')
      return
      break
    case 1:
    case 2:
      alert('sets.json file is missing some settings!')
      return
      break
  }

  if (userData.users.length === 0) {
    setModal('jsonFileError', 5000);
    return;
  }
  // all data files are existing and useable
  return dataObject;
};

export { collectDatas, checkDatas };