let isVisible = false;

function checkBoxStatus() {
  let checkbox = document.getElementById(`privacy-checkbox`);
  if (checkbox.checked) {
    console.log("Yes it is checked");
  } else {
    console.log("No no it is not checked");
  }
}


/**  
 * Changes the password field icon from lock to invisible based on input length. 
 * @param {string} pwId - password field element
 * @param {string} pwImgId - password field icon element
 */
function pwIconChanger(pwId, pwImgId){
  const passwordInput = document.getElementById(pwId);
  const passwordFieldIcon = document.getElementById(pwImgId);
  if (passwordInput.value.length > 0) {
    passwordFieldIcon.src = "/assets/img/log_in/visibility_off.png"
  }else{
    passwordFieldIcon.src = "/assets/img/log_in/lock.png"
  }
}


/**
 * Input listeners for password field and password-repeat field. 
 * @param {string} "input" - Event type, listens for input events.
 * @param {function} pwIconChanger - Function to be called on input events. 
 */
let passwordField = document.getElementById("password")
let passwordRepeatField = document.getElementById(`password-repeat`)
passwordField.addEventListener("input", () => {
  pwIconChanger("password", "password-img")
})
passwordRepeatField.addEventListener("input", ()=> {
  pwIconChanger("password-repeat", "password-repeat-img")
})


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








