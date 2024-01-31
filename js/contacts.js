
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


async function contactsInit() {
  loadAll();
  let finalArray = await sortAndPrepare("userData");
  renderContacts(finalArray);
}

/**
 * Prepares a JSONArray and sorts it. Adds initials to the final Array
 * @param remoteKey Key that is needed to 
 */
async function sortAndPrepare(remoteKey) {
  let userData = JSON.parse(await getItem(remoteKey));
  let arrayOfArrays = createArrayOfArrays(userData);
  let sortedArray = arrayOfArrays.sort();
  let finalArray = addInitials(sortedArray);
  return finalArray;
}


function calculateColorMap(index) {
  let colorMapLen = Object.keys(colorCarousell).length;
  if (index >= colorMapLen) {
    index = index % colorMapLen;
  }
  return index;
}


async function renderContacts(finalArray) {
  let contactsFrame = document.getElementById(`contacts-frame`);
  let contactsArray = finalArray;
  let singleLetterCollection = "";
  for (let i = 0; i < contactsArray.length; i++) {
    let singleContactData = contactsArray[i];
    let singleLetter = singleContactData[2][0];
    singleLetterCheck(singleLetter, singleLetterCollection, contactsFrame, i);
    let initials = singleContactData[2];
    let name = singleContactData[0];
    let email = singleContactData[1];
    let colorIndex = calculateColorMap(i);
    contactsFrame.innerHTML += contactFrameHTML(initials, name, email, colorIndex, i);
    if (i == 0) {
      document.querySelector(`.single-letter-box`).classList.add("first-letter");
    }
    singleLetterCollection += singleLetter;
  }
}


function singleLetterCheck(singleLetter, singleLetterCollection, contactsFrame, i) {
  if (!singleLetterCollection.includes(singleLetter)) {
    contactsFrame.innerHTML += singleLetterAndStrokeHTML(singleLetter, i);
  }
}


function createArrayOfArrays(JSONArray) {
  let userDataAsArray = [];
  let userData = JSONArray;
  for (let i = 0; i < userData.length; i++) {
    let element = Object.values(userData[i]);
    userDataAsArray.push(element);
  }
  return userDataAsArray;
}


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


function activeContactTab(i) {
  clearTabStyle();
  let contactTab = document.querySelector(`.contact-frame${i}`);
  let contactTabName = document.querySelector(`.name${i}`);
  contactTab.classList.add("active-tab-bg");
  contactTabName.classList.add("active-tab-name");
  showContactDetails(i);
}


function clearTabStyle() {
  let lastActiveTab = document.querySelector(`.active-tab-bg`);
  let lastActiveTabName = document.querySelector(`.active-tab-name`);
  if (!lastActiveTab) {
    return;
  }
  lastActiveTab.classList.remove("active-tab-bg");
  lastActiveTabName.classList.remove("active-tab-name");
}


function showContactDetails(i) {
  let contactEclipse = document.getElementById(`contact-infos__eclipse`);
  let contactName = document.getElementById(`contact-infos__name`);
  let contactMail = document.getElementById(`contact-infos__email`);
  let contactPhone = document.getElementById(`contact-infos__phone`);
  let contactDetailsArray = [contactEclipse, contactName, contactMail, contactPhone];
  clearContactDetails(contactDetailsArray);
  contactEclipse.innerHTML = document.querySelector(`.name-in-circle${i}`).innerHTML;
  contactName.innerHTML = document.querySelector(`.name${i}`).innerHTML
  contactMail.innerHTML = document.querySelector(`.mail${i}`).innerHTML
}


function clearContactDetails(contactDetailsArray) {
  for (let i = 0; i < contactDetailsArray.length; i++) {
    let contactDetail = contactDetailsArray[i];
    contactDetail.innerHTML = "";
  }
}

//! example for later usage
// Example of Dialog appearing.
function addTask(field) {
  let taskcard = document.getElementById("full-task-card");
  taskcard.classList.remove("d-none");
  setTimeout(function () {
    taskcard.classList.add("open");
  }, 0);
}
//! ----------------------------------------------------