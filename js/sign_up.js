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
 * Waits for a password input.  
 * Changes the icon from the password field from lock to invisible based on input length. 
 */
document.getElementById("password").addEventListener("input", () => {
  const passwordInput = document.getElementById("password");
  const passwordFieldIcon = document.getElementById("lock-img");
  if (passwordInput.value.length > 0) {
    passwordFieldIcon.src = "/assets/img/log_in/visibility_off.png"
  }else{
    passwordFieldIcon.src = "/assets/img/log_in/lock.png"
  }
})


/**
 * Changes the icon of the password field onclick, 
 * from visible to invisible. 
 */
function togglePasswordVisibility() {
  const passwordInput = document.getElementById("password");
  const passwordFieldIcon = document.getElementById("lock-img");
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








