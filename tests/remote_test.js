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


// Remote Storage ablauf. 
// 1. Setzen einer Globalen Variable hier tData
// 2. Beim initialisieren der Seite das Object in die Variable Laden. 
    // Hier die Funktion getTestData

// 3. In Funktionen auf die Globale zugreifen und Veränderungen durchführen. 
    // Diese Funktionen müssen nicht async sein

// 4. In der Funktion die Veränderung mit setItem() wieder zum Server laden, 
  // Damit bei der nächsten Initialisierung die Daten sauber geladen werden können.

let tData;
getTestData();

async function getTestData() {
  let parsedData = JSON.parse(await getItem("testData"));
  tData = parsedData;
}

let ContactsDummyData = [
  ["Dennis Schmidt", "john.doe@gmail.com", "01778334899"],
  ["Alice Schenger", "alice.smith@web.de", "01768354332"]
];

// setItem("testData", ContactsDummyData);


function logTdata() {
  tData.push("moreHello");
  console.log(tData);
  setItem("testData", tData);
}

function addToData() {
  tData.push("added to Data!!!");
  console.log(tData);
  setItem("testData", tData);
}

async function logTestData() {
  let parsedData = JSON.parse(await getItem("testData"));
  console.log(parsedData);
}










