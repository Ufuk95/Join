

//! Setting empty array into remote storage
let myArray = []
// setItem("userNameEmailPassword", myArray)
//!


// ! Test purpose log function
async function logFromRemote(remoteKey) {
  let parsedData = JSON.parse(await getItem(remoteKey));
  console.log(parsedData);
}
logFromRemote("userNameEmailPassword")
// ! ---------------------------------------------------------


let signUpData = [];
let pwInputVisible = false;
let pwInput = document.getElementById('password');
let pwInputRepeat = document.getElementById('password-repeat');
let userCredentialsObject = {};


/**
 * Executes after a successful sign-up / form validation. 
 * Gets the data from the input fields, puts the data in an JSON array.
 */
async function getSignUpInputs() {
  let name = document.getElementById(`name`);
  let email = document.getElementById(`mail`);
  let password = document.getElementById(`password`);
  let passwordRepeat = document.getElementById(`password-repeat`);
  handleRemoteStorage(name.value, email.value, password.value);
  clearFields(name, email, password, passwordRepeat);
  transitionHandler();
  // removeLogInAnimation();
}


/**
 * Gets existing data from remote. And adds new sign up data. 
 */
async function handleRemoteStorage(name, email, password) {
  signUpData = await getUserData("userNameEmailPassword");
  let initials = getInitials(name);
  signUpData.push(
    {
      "name": name,
      "initials": initials, 
      "email": email,
      "password": password
    }
  )
  console.log(signUpData);
  await setSignUpData("userNameEmailPassword", signUpData);
}


function getInitials(nameString) {
  let initials = "";
  let trimmedString = nameString.trim();
  let splittedNameLastName = trimmedString.split(" ");
  for (let j = 0; j < splittedNameLastName.length; j++) {
    let name = splittedNameLastName[j];
    initials += name[0].toUpperCase();
  }
  return initials;
}


function temporaryObject(name, initials, email, password, object) {
  object["name"] = name;
  object["email"] = email;
  object["password"] = password;
  object["initials"] = initials;
}


async function setSignUpData(remoteKey, JSONArray) {
  await setItem(remoteKey, JSON.stringify(JSONArray));
}

/**
 * Gets user data from remote
 */
async function getUserData(remoteKey) {
  let remoteValue = JSON.parse(await getItem(remoteKey));
  return remoteValue;
}


function clearFields(name, email, password, passwordRepeat) {
  name.value = "";
  email.value = "";
  password.value = "";
  passwordRepeat.value = "";
}

/**  
 * Changes the password field icon from lock to invisible based on pwInput length. 
 * @param {string} pwId - password field element
 * @param {string} pwImgId - password field icon element
 */
function pwIconChanger(pwId, pwImgId) {
  const passwordInput = document.getElementById(pwId);
  const passwordFieldIcon = document.getElementById(pwImgId);
  if (passwordInput.value.length > 0) {
    passwordFieldIcon.src = "/assets/img/log_in/visibility_off.png";
  } else {
    passwordFieldIcon.src = "/assets/img/log_in/lock.png";
  }
}


/**
 * Input listeners for password field and password-repeat field. 
 * @param {string} "input" - Event type, listens for pwInput events.
 * @param {function} pwIconChanger - Function to be called on pwInput events. 
 */
let passwordField = document.getElementById("password");
let passwordRepeatField = document.getElementById(`password-repeat`);
passwordField.addEventListener("input", () => {
  pwIconChanger("password", "password-img");
});
passwordRepeatField.addEventListener("input", () => {
  pwIconChanger("password-repeat", "password-repeat-img");
});


/**
 * Changes the icon of the password field onclick, 
 * from visible to invisible. 
 * @param {string} passwordId - id of password element
 * @param {string} passwordImg - id of password image
 */
function togglePasswordVisibility(passwordId, passwordImg) {
  const passwordInput = document.getElementById(passwordId);
  const passwordFieldIcon = document.getElementById(passwordImg);
  if (!pwInputVisible) {
    passwordInput.type = "text";
    passwordFieldIcon.src = "/assets/img/log_in/visibility.png";
    pwInputVisible = true;
  } else {
    passwordInput.type = "password";
    passwordFieldIcon.src = "/assets/img/log_in/visibility_off.png";
    pwInputVisible = false;
  }
}


/**
 *Notifies the user about a successful sign up. 
 */
function signUpSuccessNotice() {
  document.getElementById(`sign-up-success`).style.display = "flex";
  setTimeout(() => {
    document.getElementById(`sign-up-success`).style.display = "none";
  }, 1300 );
}


/**
 * Puts a transparent grey ovelay over the window. 
 */
function greyOverlay() {
  document.querySelector(`.grey-overlay`).classList.remove("display-none");
}


/**
 * Handles the animation and the transition to login.html after a successful sign up.
 */
function transitionHandler() {
  signUpSuccessNotice();
  greyOverlay();
  setTimeout(() => { window.location.href = "./logIn.html"; }, 2000);
}


function removeLogInAnimation() {
  document.querySelector(`.join-logo-animation`).classList.remove("join-logo-animation");
}


/**
 * Validates the password and the password repeat. 
 */
function pwCheck() {
  console.log("change recognized");
  if (pwInput.value != pwInputRepeat.value) {
    pwInput.setCustomValidity('Password Must be Matching.');
  } else {
    pwInput.setCustomValidity('');
  }
}


/**
 * Listener for changes in the password fields. 
 */
pwInput.addEventListener("input", () => {
  pwCheck();
});
pwInputRepeat.addEventListener("input", () => {
  pwCheck();
});




// ! Will be removed Exist for clearing purpuse
let emptyArray = [];
async function clearTestData(remoteKey) {
  await setItem(remoteKey, JSON.stringify(emptyArray));
}
// ! fire this function to clear remote storage!
// clearTestData("remoteKey")
