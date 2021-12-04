'use strict';
const url = 'assets/states.json'
const country = document.querySelector('#country');
const state = document.querySelector('#state');
let values = {};

const getData = async () => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    alert(`${url} not found`);
    return false;
  }
};

const fillStateOrCounty = () => {
  const selected = country.value;
  state.innerHTML = '';
  values[selected].map(item => state
    .insertAdjacentHTML('beforeend', `<option>${item}</option>`));
};

const fillCountries = () => {
  Object.keys(values).map(item => country
    .insertAdjacentHTML('beforeend', `<option>${item}</option>`));
};

// starter IIFE
(() => {
  getData().then(data => values = data || { USA: ['missing data'], HUN: ['hiányzó adat'] }
  ).then(() => {
    fillCountries();
    country.addEventListener('change', fillStateOrCounty)
  });
}
)();
