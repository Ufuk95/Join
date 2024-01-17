let isVisible = false

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
 * @param {string} "pwInput" - Event type, listens for pwInput events.
 * @param {function} pwIconChanger - Function to be called on pwInput events. 
 */
let passwordField = document.getElementById("password");
let passwordRepeatField = document.getElementById(`password-repeat`);
passwordField.addEventListener("pwInput", () => {
  pwIconChanger("password", "password-img");
});
passwordRepeatField.addEventListener("pwInput", () => {
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
  if (!isVisible) {
    passwordInput.type = "text";
    passwordFieldIcon.src = "/assets/img/log_in/visibility.png";
    isVisible = true;
  } else {
    passwordInput.type = "password";
    passwordFieldIcon.src = "/assets/img/log_in/visibility_off.png";
    isVisible = false;
  }
}


/**
 *Notifies the user about a successful sign up. 
 */
function signUpSuccessNotice(){
  document.getElementById(`sign-up-success`).style.display = "flex";
  setTimeout(() => {
    document.getElementById(`sign-up-success`).style.display = "none";
  }, 1000);
}


function greyOverlay(){
  document.querySelector(`.grey-overlay`).classList.remove("display-none")
}


/**
 * Handles the animation and the transition to login.html after a successful sign up.
 */
function transitionHandler(){
  signUpSuccessNotice()
  greyOverlay()
  setTimeout(()=> {window.location.href = "./logIn.html"}, 2000)
}


/**
 * Executes after a successful sign-up / form validation. 
 * Gets the data from the input fields, puts the data in an JSON array.
 */
function getSignUpInputs() {
  let nameValue = document.getElementById(`name`).value;
  let emailValue = document.getElementById(`mail`).value;
  let passwordValue = document.getElementById(`password`).value
  storeSignUpInputs(nameValue, emailValue, passwordValue)
  setItem("userData", signUpDataCollection)
  transitionHandler()
  console.log(signUpDataCollection);
}


/**
 * Stores sign up user inputs in an object, pushes the object into an array.
 */
function storeSignUpInputs(name, email, password){
  let oneUserSignUpData = {
    name,
    email,
    password,
  };
  signUpDataCollection.push(oneUserSignUpData);
}


let pwInput = document.getElementById('password');
let pwInputRepeat = document.getElementById('password-repeat');


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
pwInput.addEventListener("input", () =>{
  pwCheck()
})
pwInputRepeat.addEventListener("input", () =>{
  pwCheck()
})




