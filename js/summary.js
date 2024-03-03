
function getArray(key) { return JSON.parse(localStorage.getItem(key)); }
function setArray(key, array) { localStorage.setItem(key, JSON.stringify(array)); }

let myUser = getArray("loggedInUser")

document.getElementById(`person-name`).innerHTML = myUser["name"].split(" ")[0]