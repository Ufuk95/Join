
let finalArray;

let colorCarousell = {
  "0": "#FF7A00",
  "1": "#9327FF",
  "2": "#6E52FF",
  "3": "#FC71FF",
  "4": "#FFBB2B",
  "5": "#1FD7C1",
  "6": "#462F8A",
  "7": "#FF4646",
};

// ! Test purpose log function
async function logFromRemote(remoteKey) {
  let parsedData = JSON.parse(await getItem(remoteKey));
  console.log();
  return parsedData;
}

async function getParsedData() {
  let getFromRemote = logFromRemote("userData");
  return getFromRemote;
}


//  console.log(contactsArray);
// ! ---------------------------------------------------------


/**
 * Initialization of contacts.html
*/
async function contactsInit() {
  loadAll();
  finalArray = await sortAndPrepare("userData");
  // console.log(finalArray);
  renderContacts(finalArray);
}


/**
 * Prepares a JSONArray and sorts it. Adds initials to the final Array
 * @param {string} remoteKey Key to acces remote Data
 * @returns {Array} 
 */
async function sortAndPrepare(remoteKey) {
  let userData = JSON.parse(await getItem(remoteKey));
  contactsArray = userData;
  let sortedArray = userData.sort();
  let finalArray = addInitials(sortedArray);
  return finalArray;
}



/**
 * Calculates an index based on the amount of colors in colorCarousell.
 * @param {Number} index Index number of a contact. 
 * @return {Number} 
 */
function calculateColorMap(index) {
  let colorMapLen = Object.keys(colorCarousell).length;
  if (index >= colorMapLen) {
    index = index % colorMapLen;
  }
  return index;
}


/**
 * Renders contacts on the left side of the page. 
 * @param {Array} finalArray prepared and Sorted array. Ready to be rendered.   
 */
function renderContacts(finalArray) {
  let contactsFrame = document.getElementById(`contacts-frame`);
  contactsFrame.innerHTML = "";
  contactsFrame.innerHTML += contactButtonHTML();
  let singleLetterCollection = "";
  for (let i = 0; i < finalArray.length; i++) {
    let singleContactData = finalArray[i];
    let singleLetter = singleContactData[2][0];
    singleLetterCheck(singleLetter, singleLetterCollection, contactsFrame, i);
    let initials = singleContactData[2];
    let name = singleContactData[0];
    let email = singleContactData[1];
    let colorIndex = calculateColorMap(i);
    contactsFrame.innerHTML += contactFrameHTML(initials, name, email, colorIndex, i);
    singleLetterCollection += singleLetter;
  }
}


/**
 * Checks if a letter is already present. 
 * Renders a capital Letter and a stroke based on that.
 */
function singleLetterCheck(singleLetter, singleLetterCollection, contactsFrame, i) {
  if (!singleLetterCollection.includes(singleLetter)) {
    contactsFrame.innerHTML += singleLetterAndStrokeHTML(singleLetter, i);
  }
}


/**
 * Adds initials from the for- and lastname.
 * @param {Array} sortedArray 
 * @returns {Array}
 */
function addInitials(sortedArray) {
  let initials = "";
  for (let i = 0; i < sortedArray.length; i++) {
    let nameAndLastNameArray = sortedArray[i];
    let nameAndLastNameString = sortedArray[i][0].trim();
    let splittedNameLastName = nameAndLastNameString.split(" ");
    for (let j = 0; j < splittedNameLastName.length; j++) {
      let name = splittedNameLastName[j];
      initials += name[0].toUpperCase();
    }
    if (sortedArray[i].length <= 3) {
      nameAndLastNameArray.splice(2, 0, initials);
    } else if (sortedArray[i][2].length <= 2) {
      nameAndLastNameArray.splice(2, 1, initials);
    }
    initials = "";
  }
  return sortedArray;
}


/**
 * Executes when clicking a contact tab on the left side. 
 * Clears unwanted styles. Adds wanted styles.
 * Triggers the contact details on the right side to be shown.
 * @param {Number} i Index of the contact. 
 */
function activeContactTab(i) {
  clearTabStyle();
  if(document.querySelector(`.no-hover`)){
    document.querySelector(`.no-hover`).classList.remove("no-hover") 
  }
  let contactDetailsBox = document.querySelector(`.contact-infos-box`);
  handleTransition(contactDetailsBox);
  let contactTab = document.querySelector(`.contact-frame${i}`);
  let contactTabName = document.querySelector(`.name${i}`);
  contactTab.classList.add("active-tab-bg");
  contactTabName.classList.add("active-tab-name");
  contactTab.classList.add("no-hover")
  showContactDetails(i);
}


/**
 * Handles the transition for the contact details on the right side. 
 */
function handleTransition(element) {
  element.classList.remove("display-none");
  element.classList.add("transition");
  setTimeout(() => { element.classList.remove("transition"); }, 400);
}


/**
 * Clears unwanted styles from contacts on the left. 
 */
function clearTabStyle() {
  let lastActiveTab = document.querySelector(`.active-tab-bg`);
  let lastActiveTabName = document.querySelector(`.active-tab-name`);
  if (!lastActiveTab) {
    return;
  }
  lastActiveTab.classList.remove("active-tab-bg");
  lastActiveTabName.classList.remove("active-tab-name");
}


function getContactDetailElements() {
  return {
    contactEclipse: document.getElementById(`contact-infos__eclipse`),
    contactName: document.getElementById(`contact-infos__name`),
    contactMail: document.getElementById(`contact-infos__email`),
    contactPhone: document.getElementById(`contact-infos__phone`),
    deleteBtn : document.getElementById("contact-infos__delete"),
    editBtn:  document.getElementById(`contact-infos__edit`)
  };
}

/**
 * Renders data of a clicked contact into the contact detail template.
 */
async function showContactDetails(i) {
  finalArray.sort();
  let {contactEclipse, contactName, contactMail, contactPhone, deleteBtn, editBtn} = getContactDetailElements()
  let contactDetailsArray = [contactEclipse, contactName, contactMail, contactPhone];
  clearContactDetails(contactDetailsArray);
  contactEclipse.innerHTML = document.querySelector(`.name-in-circle${i}`).innerHTML;
  contactName.innerHTML = document.querySelector(`.name${i}`).innerHTML;
  contactMail.innerHTML = document.querySelector(`.mail${i}`).innerHTML;
  contactPhone.innerHTML = finalArray[i][3];
  deleteBtn.setAttribute("onclick", `deleteContact(${i})`);
  editBtn.setAttribute("onclick", `editContact(${i})`);
}


/**
 * Clears the contact detail template.
 */
function clearContactDetails(contactDetailsArray) {
  for (let i = 0; i < contactDetailsArray.length; i++) {
    let contactDetail = contactDetailsArray[i];
    contactDetail.innerHTML = "";
  }
}


/**
 * Executes on clicking the add new contact button.
 */
function addNewContactBtn() {
  document.querySelector(`.dialog-bg`).classList.remove("display-none");
  let addContactFrame = document.querySelector(`.add-contact-frame`);
  addContactFrame.classList.remove("display-none");
  addContactFrame.classList.add("transition__add-contact");
  addContactFrame.innerHTML = addContactTemplate();
}


/**
 * Closes the dialog and the add new contact form.
 */
function navigateBack() {
  let addContactFrame = document.querySelector(`.add-contact-frame`);
  document.querySelector(`.dialog-bg`).classList.add("display-none");
  document.querySelector(`.add-contact-frame`).classList.add("display-none");
  addContactFrame.classList.remove("transition__add-contact");
}


/**
 * Executes on Create button.
 * Adds a new contact to the existing contacts array. Sorts the array in the proccess. 
 */
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
  activeContactTab(newIndex)
  navigateBack();
}


function clearContactInputs(contactName, contactEmail, contactPhone) {
  contactName.value = "";
  contactEmail.value = "";
  contactPhone.value = "";
}

async function deleteContact(i) {
  finalArray.splice(i, 1);
  document.querySelector(`.contact-infos-box`).classList.add("display-none");
  await setItem("userData", finalArray);
  renderContacts(finalArray);
}


/**
 * Executes on edit button. 
 * Gets the contact details into the input fields. 
 */
async function editContact(i) {
  let addContactFrame = document.querySelector(`.add-contact-frame`);
  addContactFrame.innerHTML = editContactTemplate();
  let saveBtn = document.querySelector(`.save-btn`);
  saveBtn.setAttribute("onclick", `saveEditedData(${i})`);
  document.querySelector(`.dialog-bg`).classList.remove("display-none");
  addContactFrame.classList.remove("display-none");
  addContactFrame.classList.add("transition__add-contact");
  let nameEclipseValue = document.querySelector(`.name-in-circle${i}`).innerHTML;
  document.querySelector(`.add-contact__img-placeholder`).innerHTML = nameEclipse(nameEclipseValue);
  let { nameField, emailField, phoneField } = getInputFieldElement();
  nameField.value = finalArray[i][0];
  emailField.value = finalArray[i][1];
  phoneField.value = finalArray[i][3];
}


function getInputFieldElement() {
  return {
    nameField: document.querySelector(`.edit-name`),
    emailField: document.querySelector(`.edit-email`),
    phoneField: document.querySelector(`.edit-phone`)
  };
}


/**
 * Executes on the save button. 
 * Edited contact details getting saved in the finalArry. 
 */
async function saveEditedData(i) {
  let editedIndex;
  let { nameField, emailField, phoneField } = getInputFieldElement();
  finalArray[i][0] = nameField.value;
  finalArray[i][1] = emailField.value;
  finalArray[i][3] = phoneField.value;
  let userDataInitials = addInitials(finalArray).sort();
  editedIndex = getNewIndex(userDataInitials, emailField.value);
  renderContacts(userDataInitials);
  await setItem("userData", userDataInitials);
  activeContactTab(editedIndex);
  navigateBack();
}


/**
 * Gets the new index of a changed contact. 
 *
 */
function getNewIndex(finalArray, email) {
  for (let j = 0; j < finalArray.length; j++) {
    let element = finalArray[j];
    if (element[1] === email) {
      return j;
    }
  }
}



