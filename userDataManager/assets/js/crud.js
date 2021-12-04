'use strict';

import communicateServer from "./fetch.js";
import { files } from "./main.js";

// CREATE user.
const newUser = async (userObject) => {
  await communicateServer('CREATE', `${files.URL}${files.contentJSON}`, userObject);
};

// READ user.
const readData = async (url, jsonPart = '') => {
  return await communicateServer('READ', `${url}${jsonPart}`);
};

// UPDATE user.
const updateUser = async (userId, userObject) => {
  await communicateServer('UPDATE', `${files.URL}${files.contentJSON}/${userId}`, userObject);
};

// DELETE user.
const deleteUser = async (userId) => {
  await communicateServer('DELETE', `${files.URL}${files.contentJSON}/${userId}`);
};

export { deleteUser, updateUser, newUser, readData };