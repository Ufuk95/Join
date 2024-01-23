let pwInputVisible = false;
let pwInput = document.getElementById('password');
let pwInputRepeat = document.getElementById('password-repeat');
let signUpNameEmail = [];
let emailPwCombo = {};


/**
 * Executes after a successful sign-up / form validation. 
 * Gets the data from the input fields, puts the data in an JSON array.
 */
async function getSignUpInputs() {
  let name = document.getElementById(`name`);
  let email = document.getElementById(`mail`);
  let password = document.getElementById(`password`);
  let passwordRepeat = document.getElementById(`password-repeat`);
  signUpNameEmail =  await getUserData("userData");
  emailPwCombo =  await getUserData("mailPwCombo");
  storeInTemporaryArray("name", name.value, "email", email.value, signUpNameEmail)
  storeInTemporaryArray("email", email.value, "password", password.value, emailPwCombo)
  await setSignUpData("userData", signUpNameEmail);
  await setSignUpData("mailPwCombo", emailPwCombo);
  console.log(signUpNameEmail);
  clearFields(name, email, password, passwordRepeat);
  // transitionHandler();
  // removeLogInAnimation();
}
 
// ! Will be removed Exist for clearing purpuse
let emptyArray = [];
async function clearTestData(remoteKey) {
  await setItem(remoteKey, JSON.stringify(emptyArray));
}
// ! fire this function to clear remote storage!
// clearTestData("remoteKey")

/**
 * Stores sign up user inputs in an object, pushes the object into an array.
 */
let testArray = []
function storeInTemporaryArray(key1, value1, key2,  value2,  JSONArray) {
  let oneUserSignUpData = {}
  oneUserSignUpData[key1] = value1
  oneUserSignUpData[key2] = value2
  JSONArray.push(oneUserSignUpData);
}

function storeInTemporaryObject(key1, value1, key2, value2, object){
  object
}

function storeSignUpNameEmail(name, email) {
  let oneUserSignUpData = {
    name,
    email,
  };
  emailPwCombo.push(oneUserSignUpData);
}


async function setSignUpData(remoteKey, JSONArray) {
  await setItem(remoteKey, JSON.stringify(JSONArray));
}


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
  }, 1000);
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
})




