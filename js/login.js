//! Delete
async function logFromRemote(remoteKey) {
  let parsedData = JSON.parse(await getItem(remoteKey));
  console.log(parsedData);
}
// logFromRemote("userNameEmailPassword");
//! Delete

let checked = false;
let isVisible = false; // Variable, um den Sichtbarkeitsstatus des Passwortes zu speichern
let userData;
let emailInputField = document.getElementById(`email`);
let passwordInputField = document.getElementById(`password`);
let userInitals = null;


async function logInInit() {
  userData = JSON.parse(await getItem("userNameEmailPassword"));
}

//!
let loggedUser = null;
function getArray(key) { return JSON.parse(localStorage.getItem(key)); }
function setArray(key, array) { localStorage.setItem(key, JSON.stringify(array)); }

// setArray("loggedInUser", loggedUser);
// let userNameInitials = getArray("loggedInUser");
// console.log(userNameInitials);
//!


function login() {
  let email = document.getElementById("email");
  let password = document.getElementById("password");
  console.log(userData);
  emailCheck(email, password);
}


function emailCheck(email, password) {
  let emailFound = false;
  let emailFoundIndex = 0;
  for (let i = 0; i < userData.length; i++) {
    let user = userData[i];
    if (user["email"] === email.value) {
      emailFound = true;
      emailFoundIndex = i;
    }
  }
  if (!emailFound) {
    console.log("email not found");
  } else if (userData[emailFoundIndex]["password"] === password.value) {
    positiveLogin(emailFoundIndex);
  } else {
    console.log("Wrong password");
  }
}


function positiveLogin(i) {
  userName = userData[i]["name"];
  userInitals = userData[i]["initials"];
  let loggedInUser = {
    "name": userName,
    "initials": userInitals
  };
  setArray("loggedInUser", loggedInUser)
  window.location.href = "./summary.html";
}


function guestLoginIn() {
  let loggedInUser = {
    "name": "Guest",
    "initials": "GU"
  };
  setArray("loggedInUser", loggedInUser)
  window.location.href = "./summary.html";
}


function togglePasswordVisibility() {
  const passwordInput = document.getElementById("password");
  const lockImg = document.getElementById("img-lock");

  if (!isVisible) {
    passwordInput.type = "text";
    lockImg.src = "/assets/img/log_in/visibility.png"; // Pfad zum Bild der Sichtbarkeit
    isVisible = true;
  } else {
    passwordInput.type = "password";
    lockImg.src = "/assets/img/log_in/visibility_off.png"; // Pfad zum Bild des geschlossenen Auges
    isVisible = false;
  }
}

// Wenn Text im Passwortfeld eingetragen wird, ändert sich das Bild
document.getElementById("password").addEventListener("input", function () {
  const passwordInput = document.getElementById("password");
  const lockImg = document.getElementById("img-lock");

  if (passwordInput.value.length > 0) {
    if (!isVisible) {
      lockImg.src = "/assets/img/log_in/visibility_off.png"; // Pfad zum Bild des geschlossenen Auges
    } else {
      lockImg.src = "/assets/img/log_in/visibility.png";
    }
  } else {
    lockImg.src = "/assets/img/log_in/lock.png"; // Pfad zum Bild des Schlosses
  }
});

// Funktion die den Haken setzt bei Remember me
function changeRectangle() {
  let checkedRectangle = document.getElementById("rectangle");

  if (checked) {
    checkedRectangle.src = "./assets/img/log_in/not-checked.png";
    checked = false;
  } else {
    checkedRectangle.src = "./assets/img/log_in/checked.png";
    checked = true;
  }
}
