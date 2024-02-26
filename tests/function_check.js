function editContact(i) {
  let addContactFrame = document.querySelector(`.add-contact-frame`);
  // Ranholen von einer Div
  addContactFrame.innerHTML = editContactTemplate();
  // Befüllen der Di
  let saveBtn = document.querySelector(`.save-btn`);
  // btn element selecten
  saveBtn.setAttribute("onclick", `saveEditedData(${i})`);
  // btn Element mit einem zusätzlichen Attribut versehen
  document.querySelector(`.dialog-bg`).classList.remove("display-none");
  // 
  addContactFrame.classList.remove("display-none");
  addContactFrame.classList.add("transition__add-contact");
  let nameEclipseValue = document.querySelector(`.name-in-circle${i}`).innerHTML;
  document.querySelector(`.add-contact__img-placeholder`).innerHTML = nameEclipse(nameEclipseValue);
  let { nameField, emailField, phoneField } = getInputFieldElement();
  nameField.value = finalArray[i][0];
  emailField.value = finalArray[i][1];
  phoneField.value = finalArray[i][3];
}