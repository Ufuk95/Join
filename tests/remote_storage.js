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


// Schreibe eine Funktion die Daten aus den Input -Feldern nimmt. 
// Diese Daten sollen in ein Array geschrieben werden. 
// Dieses Array soll in ein bestehendes array gepushed werden. 

// Lade dieses Array in den remote storage und nenne es key =  "array1"

// Rufe dieses Array von remote ab, und füge dem Array 1 beliebiges item hinzu. 
// Lade es anschließend wieder hoch 


// Schreibe eine ähnliche Funktion wie oben. Nur dass die Daten aus den input-feldern in ein object geschrieben
// werden sollen. Die Daten aus input-one sollen unter dem key input-one rein, und die Daten aus input-two  
// in den key input-two. Pushe dieses Object immer wieder in ein Array, so das ein JSONArray entsteht. 
// Lade dieses JSONArray hoch ins backend gebe den keynamen object1. 

// Rufe dieses Array ab. 

function getData(){
}


