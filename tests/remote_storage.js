// Tests for remote storage

// generate tokens at  https://remote-storage.developerakademie.org/token-generator
const STORAGE_TOKEN = '6OT5NHLEZTIV1ASE5C02UCNNGQZH7TEB6HQPFP5F';
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

// -------------------------------------------- USER LOGIN GET DATA EXAMPLE -------------------------------------


let users = [];

// Loading users from remote-storage into the array
async function init() {
  await loadUsers();
}

// loads users array onload
async function loadUsers() {
  users = JSON.parse(await getItem("usersCollection"));
  console.log(users);
}

console.log(users);


// By using the <form> tag IDs are recognized in the function.
async function register() {
  users.push({ email: email.value, password: password.value });
  await setItem("usersCollection", JSON.stringify(users));
}

async function logUsers() {
  console.log(users);
}


