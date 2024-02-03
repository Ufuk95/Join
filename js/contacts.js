
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


/**
 * Initialization of contacts.html
 */
async function contactsInit() {
  loadAll();
  let finalArray = await sortAndPrepare("userData");
  renderContacts(finalArray);
}

/**
 * Prepares a JSONArray and sorts it. Adds initials to the final Array
 * @param {string} remoteKey Key to acces remote Data
 * @returns {Array} 
 */
async function sortAndPrepare(remoteKey) {
  let userData = JSON.parse(await getItem(remoteKey));
  let arrayOfArrays = createArrayOfArrays(userData);
  let sortedArray = arrayOfArrays.sort();
  let finalArray = addInitials(sortedArray);
  console.log(finalArray);
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
async function renderContacts(finalArray) {
  let contactsFrame = document.getElementById(`contacts-frame`);
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
 * Creates an array of arrays. 
 * @param {object} JSONArray object with collected data from sign-up.html
 */
function createArrayOfArrays(JSONArray) {
  let userDataAsArray = [];
  let userData = JSONArray;
  for (let i = 0; i < userData.length; i++) {
    let element = Object.values(userData[i]);
    userDataAsArray.push(element);
  }
  return userDataAsArray;
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
    let nameAndLastNameString = sortedArray[i][0];
    let splittedNameLastName = nameAndLastNameString.split(" ");
    for (let j = 0; j < splittedNameLastName.length; j++) {
      let name = splittedNameLastName[j];
      initials += name[0].toUpperCase();
    }
    nameAndLastNameArray.splice(2, 0, initials);
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
  let contactDetailsBox = document.querySelector(`.contact-infos-box`);
  handleTransition(contactDetailsBox)
  let contactTab = document.querySelector(`.contact-frame${i}`);
  let contactTabName = document.querySelector(`.name${i}`);
  contactTab.classList.add("active-tab-bg");
  contactTabName.classList.add("active-tab-name");
  showContactDetails(i);
}


/**
 * Handles the transition for the contact details on the right side. 
 */
function handleTransition(element){
  element.classList.remove("display-none");
  element.classList.add("transition");
  setTimeout(() => {element.classList.remove("transition")}, 400)
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


/**
 * Renders data of a clicked contact into the contact detail template.
 */
function showContactDetails(i) {
  let contactEclipse = document.getElementById(`contact-infos__eclipse`);
  let contactName = document.getElementById(`contact-infos__name`);
  let contactMail = document.getElementById(`contact-infos__email`);
  let contactPhone = document.getElementById(`contact-infos__phone`);
  let contactDetailsArray = [contactEclipse, contactName, contactMail, contactPhone];
  clearContactDetails(contactDetailsArray);
  contactEclipse.innerHTML = document.querySelector(`.name-in-circle${i}`).innerHTML;
  contactName.innerHTML = document.querySelector(`.name${i}`).innerHTML;
  contactMail.innerHTML = document.querySelector(`.mail${i}`).innerHTML;
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


function addNewContactBtn(){
  document.querySelector(`.dialog-bg`).classList.remove("display-none")
  let addContactFrame = document.querySelector(`.add-contact-frame`)
  addContactFrame.classList.remove("display-none")
  addContactFrame.classList.add("transition__add-contact")
}


function navigtateBack(){
  let addContactFrame = document.querySelector(`.add-contact-frame`)
  document.querySelector(`.dialog-bg`).classList.add("display-none")
  document.querySelector(`.add-contact-frame`).classList.add("display-none")
  addContactFrame.classList.remove("transition__add-contact")
}