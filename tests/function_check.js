async function saveEditedData(i) {
  let editedIndex;
  let { nameField, emailField, phoneField } = getInputFieldElement();
  finalArray[i][0] = nameField.value;
  finalArray[i][1] = emailField.value;
  finalArray[i][3] = phoneField.value;
  let userDataInitials = addInitials(finalArray).sort();
  editedIndex = getNewIndex(userDataInitials, emailField.value);
  renderContacts(userDataInitials);
  setItem("userData", userDataInitials);
  activeContactTab(editedIndex);
  navigateBack();
}


async function getContactData() {
  let contactName = document.getElementById(`add-contact__name`);
  let contactEmail = document.getElementById(`add-contact__email`);
  let contactPhone = document.getElementById(`add-contact__phone`);
  let contactDataArray = [[contactName.value, contactEmail.value, contactPhone.value]];
  let sortedContactData = addInitials(contactDataArray);
  finalArray.push(sortedContactData[0]);
  finalArray.sort();
  setItem("userData", finalArray);
  let newIndex = getNewIndex(finalArray, contactEmail.value)
  renderContacts(finalArray);
  clearContactInputs(contactName, contactEmail, contactPhone);
  activeContactTab(editedIndex)
  navigateBack();
}
