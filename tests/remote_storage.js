// Tests for remote storage

// generate tokens at  https://remote-storage.developerakademie.org/token-generator
const STORAGE_TOKEN = '8RLSPP294RL2SQXQDY9KO3BLXKSMB4WUNVXGDP2S';
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
 * returns a json
 */
async function getItem(key) {
  const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
  return fetch(url).then(res => res.json());
}

// Getting data from user email password sign in

// Loading users from remote-storage into the array
async function init(){
  loadUsers()
}

let users = [];

// By using the <form> tag IDs can be used in the onsubmit function.
//    
async function register() {
  users.push({ email: email.value, password: password.value});
  setItem("usersCollection", JSON.stringify(users))
}


async function getUsers(){
  console.log(await getItem("usersCollection"));
}


getUsers()

