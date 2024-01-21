
// Example of Dialog appearing.
function addTask(field) {
  let taskcard = document.getElementById("full-task-card");
  taskcard.classList.remove("d-none");
  setTimeout(function () {
    taskcard.classList.add("open");
  }, 0);
}


// async function setHardcodedData() {
//   await setItem("userData", ContactsDummyData);
// }
// setHardcodedData()

async function contactsInit() {

}

async function renderContacts(remoteKey) {
  let contactsFrame = document.getElementById(`contacts-frame`);
  contactsFrame.innerHTML += `<div class="single-letter-box"> B </div> `
  console.log(contactsFrame);
  let contactsArray = JSON.parse(await getItem(remoteKey));
}
renderContacts("contactsArray")


async function createArrayOfArrays(remoteKey) {
  let userDataAsArray = [];
  let userData = JSON.parse(await getItem(remoteKey));
  for (let i = 0; i < userData.length; i++) {
    let element = Object.values(userData[i]);
    userDataAsArray.push(element);
  }
  return userDataAsArray;
}

async function setSortedArray(remoteKey) {
  let userDataAsArray = await createArrayOfArrays(remoteKey);
  let sortedArray = userDataAsArray.sort();
  setItem("sortedUserArray", sortedArray);
}

setSortedArray("userData");



async function sortArray(remoteKey) {
  let userArray = await createArrayOfArrays(remoteKey);
  return userArray.sort();
}

async function addInitials() {
  let initials = "";
  let sortedArray = await JSON.parse(await getItem("sortedUserArray"));
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
  await setItem("contactsArray", sortedArray);
}

addInitials();


async function logRemoteArray(remoteKey) {
  let mySortedArray = JSON.parse(await getItem(remoteKey));
}
logRemoteArray("contactsArray");