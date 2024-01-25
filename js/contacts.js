



async function contactsInit() {
  // loadAll()
  // setSortedArray("userData");
  // renderContacts("userData")
}

async function sortAndPrepare(remoteKey) {
  let userData = JSON.parse(await getItem(remoteKey));
  let arrayOfArrays = createArrayOfArrays(userData);
  let sortedArray = arrayOfArrays.sort();
  let addedInitials = addInitials(sortedArray)
  console.log(addedInitials);
}

sortAndPrepare("userData");

async function renderContacts(remoteKey) {
  let contactsFrame = document.getElementById(`contacts-frame`);
  let contactsArray = JSON.parse(await getItem(remoteKey));
  console.log(contactsArray);
  let singleLetterCollection = "";
  for (let i = 0; i < contactsArray.length; i++) {
    let singleContactData = contactsArray[i];
    let singleLetter = singleContactData[2][0];
    singleLetterCheck(singleLetter, singleLetterCollection, contactsFrame);
    let initials = singleContactData[2];
    let name = singleContactData[0];
    let email = singleContactData[1];
    contactsFrame.innerHTML += contactFrameHTML(initials, name, email);
    singleLetterCollection += singleLetter;
  }
}


function singleLetterCheck(singleLetter, singleLetterCollection, contactsFrame) {
  if (!singleLetterCollection.includes(singleLetter)) {
    contactsFrame.innerHTML += singleLetterAndStrokeHTML(singleLetter);
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




//! Logging function fire to see remote objects
async function logRemoteArray(remoteKey) {
  let mySortedArray = JSON.parse(await getItem(remoteKey));
  console.log(mySortedArray);
}

// logRemoteArray("userData");
//! ---------------------------------------------------


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