// Tests for remote storage

// generate tokens at  https://remote-storage.developerakademie.org/token-generator
const STORAGE_TOKEN = '8DHJQSZQF965QFW74I7VYYKYDNLFNVLZVIOGXDGP';
const STORAGE_URL = 'https://remote-storage.developerakademie.org/item';

/**
 * Sends key value pair to a backend
*/
async function setItem(key, value) {
  const payload = { key, value, token: STORAGE_TOKEN };
  return fetch(STORAGE_URL, { method: 'POST', body: JSON.stringify(payload) })
    .then(res => res.json());
}

/**
 * Takes a key, creates the right url
 * returns response as a json
*/
async function getItem(key) {
  const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
  return fetch(url).then(res => res.json()).then(res => {
      if (res.data) { 
          return res.data.value;
      } throw `Could not find data with key "${key}".`;
  });
}



/**
 * Local storage functions
 */
function getArray(key) { return JSON.parse(localStorage.getItem(key)); }
function setArray(key, array) { localStorage.setItem(key, JSON.stringify(array)); }
