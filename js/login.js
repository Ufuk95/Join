let users = [{ email: "test129@web.de", password: "test12345" }];
let checked = false;
let isVisible = false; // Variable, um den Sichtbarkeitsstatus des Passwortes zu speichern

function login() {
  let email = document.getElementById("email");
  let password = document.getElementById("password");

  let user = users.find(
    (u) => u.email == email.value && u.password == password.value
  );
  console.log(user);
  if (user) {
    console.log("user gefunden");
  }
}

function togglePasswordVisibility() {
  const passwordInput = document.getElementById("password");
  const lockImg = document.getElementById("img-lock");

  if (!isVisible) {
    passwordInput.type = "text";
    lockImg.src = "/assets/img/LogIn/visibility.png"; // Pfad zum Bild der Sichtbarkeit
    isVisible = true;
  } else {
    passwordInput.type = "password";
    lockImg.src = "/assets/img/LogIn/visibility_off.png"; // Pfad zum Bild des geschlossenen Auges
    isVisible = false;
  }
}

// Wenn Text im Passwortfeld eingetragen wird, ändert sich das Bild
document.getElementById("password").addEventListener("input", function () {
  const passwordInput = document.getElementById("password");
  const lockImg = document.getElementById("img-lock");

  if (passwordInput.value.length > 0) {
    if (!isVisible) {
      lockImg.src = "/assets/img/LogIn/visibility_off.png"; // Pfad zum Bild des geschlossenen Auges
    } else {
      lockImg.src = "/assets/img/LogIn/visibility.png";
    }
  } else {
    lockImg.src = "/assets/img/LogIn/lock.png"; // Pfad zum Bild des Schlosses
  }
});

// Funktion die den Haken setzt bei Remember me
function changeRectangle() {
  let checkedRectangle = document.getElementById("rectangle");

  if (checked) {
    checkedRectangle.src = "/assets/img/login/not-checked.png";
    checked = false;
  } else {
    checkedRectangle.src = "/assets/img/login/checked.png";
    checked = true;
  }
}
