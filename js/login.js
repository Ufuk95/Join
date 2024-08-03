let checked = false;
let isVisible = false;
let userData;
let emailInputField = document.getElementById(`email`);
let passwordInputField = document.getElementById(`password`);
let userInitals = null;


async function logInInit() {
  userData = JSON.parse(await getItem("userNameEmailPassword"));
}


/**
 * Executes on clicking the login button.
 */
function login() {
  let email = document.getElementById("email");
  emailCheck(email, password);
}


function checkMailPw(email, password) {

}

/**
 * Checks the rightness of  email password combination. 
 * Logs in the user. 
 */
function emailCheck(email, password) {
  // password.setCustomValidity("Wrong email password combination.");
  let emailFound = false;
  let emailFoundIndex = 0;
  for (let i = 0; i < userData.length; i++) {
    let user = userData[i];
    if (user["email"] === email.value) {
      emailFound = true;
      emailFoundIndex = i;
    }
  }
  if (emailFound && userData[emailFoundIndex]["password"] === password.value) {
    document.querySelector(`.login-area`).reset()
    positiveLogin(emailFoundIndex)
  }
}


/**
 * Gets the name and the initlas of a user that have been logged in. 
 * Redirects to summary.html 
 */
function positiveLogin(i) {
  userName = userData[i]["name"];
  userInitals = userData[i]["initials"];
  let loggedInUser = {
    "name": userName,
    "initials": userInitals
  };
  setArray("loggedInUser", loggedInUser);
  window.location.href = "./summary.html";
}

/**
 * Handles the log in of a guest user.
 */
function guestLoginIn() {
  let loggedInUser = {
    "name": "Guest",
    "initials": "GU"
  };
  setArray("loggedInUser", loggedInUser);
  window.location.href = "./summary.html";
}


function togglePasswordVisibility() {
  const passwordInput = document.getElementById("password");
  const lockImg = document.getElementById("img-lock");

  if (!isVisible) {
    passwordInput.type = "text";
    lockImg.src = "/assets/img/log_in/visibility.png";
    isVisible = true;
  } else {
    passwordInput.type = "password";
    isVisible = false;
  }
}


document.getElementById("password").addEventListener("input", function () {
  const passwordInput = document.getElementById("password");
  const lockImg = document.getElementById("img-lock");

  if (passwordInput.value.length > 0) {
    if (!isVisible) {
      lockImg.src = "/assets/img/log_in/visibility_off.png";
    } else {
      lockImg.src = "/assets/img/log_in/visibility.png";
    }
  } else {
    lockImg.src = "/assets/img/log_in/lock.png";
  }
});


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

let pwInput = document.getElementById('password');

function pwCheck() {

  if (pwInput.value != pwInputRepeat.value) {
    pwInput.setCustomValidity('Password Must be Matching.');
  } else {
    pwInput.setCustomValidity('');
  }
}