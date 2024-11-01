'use strict';

// all CRUD options. null will filled with JSON.stringify(sendData)
const crud = {
  CREATE: {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json'
    },
    body: null
  },
  READ: {
    method: 'GET',
    mode: 'cors',
    cache: 'no-cache'
  },
  UPDATE: {
    method: 'PUT',
    mode: 'cors',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json'
    },
    body: null
  },
  DELETE: {
    method: 'DELETE',
    mode: 'cors',
    cache: 'no-cache'
  }
}

// handles any CRUD fetch to JSON-server.
const communicateServer = async (method,URL,sendData='') => {
  try {
    if (sendData) {
      crud[method].body=JSON.stringify(sendData);
    }
    const response = await fetch(URL, crud[method]);
    const data = await response.json();
    return data;
  } catch (error) {
    // proper error handling in function checkDatas
    return [];
  }
};

export default communicateServer;