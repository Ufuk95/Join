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
 * Changes visibility icon based on isVisible state
 */
document.getElementById("password").addEventListener("input", () => {
  const passwordInput = document.getElementById("password");
  const lockImg = document.getElementById("lock-img");
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


/**
 *
 *
 */
function togglePasswordVisibility() {
  const passwordInput = document.getElementById("password");
  const lockImg = document.getElementById("lock-img");
  if (!isVisible) {
    passwordInput.type = "text";
    lockImg.src = "/assets/img/log_in/visibility.png"; 
    isVisible = true;
  } else {
    passwordInput.type = "password";
    lockImg.src = "/assets/img/log_in/visibility_off.png"; 
    isVisible = false;
  }
}








