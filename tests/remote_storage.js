
// Tests for remote storage


// generate tokens at  https://remote-storage.developerakademie.org/token-generator
const STORAGE_TOKEN = '8RLSPP294RL2SQXQDY9KO3BLXKSMB4WUNVXGDP2S';
const STORAGE_URL = 'https://remote-storage.developerakademie.org/item';



/**
 * Sends key value pair to a backend
 */
async function setItem(key, value) {
    const payload = { key, value, token: STORAGE_TOKEN };
    return fetch(STORAGE_URL, { method: 'POST', body: JSON.stringify(payload)})
    .then(res => res.json());
}

async function getItem(key) {
    const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
    return fetch(url).then(res => res.json());
}

async function myData(){
  console.log(await getItem("animal"));
}

myData()
setItem("color", "blue")

getItem("color")