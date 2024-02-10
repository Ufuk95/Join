
async function saveEditedData(i) {
  // let userData = JSON.parse(await getItem("userData"));

  // Getting the changed Data out of the fields. 
  let nameFieldValue = document.querySelector(`.edit-name`).value;
  let emailFieldValue = document.querySelector(`.edit-email`).value;
  let phoneFieldValue = document.querySelector(`.edit-phone`).value;
  console.log(finalArray);
  console.log(finalArray[i]);

  // Assigning the fields to the array. 
  finalArray[i][0] = nameFieldValue;
  finalArray[i][1] = emailFieldValue;
  finalArray[i][3] = phoneFieldValue;
  console.log(finalArray[i]);
  console.log(finalArray)

  // Adding Initials to final Array
  let userDataInitials = addInitials(finalArray);
  userDataInitials.sort();
  console.log(finalArray);
  await setItem("userData", finalArray);
  renderContacts(finalArray);
  activeContactTab(i);
}