// There is an array with indexes. 


// Array gets rendered into a div. 
function renderContacts(finalArray) {
  let contactsFrame = document.getElementById(`contacts-frame`);
  contactsFrame.innerHTML = "";
  contactsFrame.innerHTML += contactButtonHTML();
  let singleLetterCollection = "";
  // The loop creates the numbers for the indexes
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

// contactFrameHTML creates class names with an index ending. 

function contactFrameHTML(initials, name, email, colorNumber, i) {
  return `
  <div class="contact-frame contact-frame${i}" onclick="activeContactTab(${i})">
  <div class="name-circle-wrapper name-in-circle${i}">
    <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle  cx="21" cy="21" r="20" fill=${colorCarousell[colorNumber]} stroke="white" stroke-width="2" />
    </svg>
    <span class="initials initials${i}">${initials}</span>
  </div>
  <div class="name-email-box">
    <span class="name-email-box__name name${i}">${name}</span>
    <span class="name-email-box__mail mail${i}">${email}</span>
  </div>
  </div>
  `;
}

//! Here is the HTML that gets created. 
// ! activeContactTab gets a argument according to the index of the Element in the array.  

`<div class="contact-frame contact-frame0 active-tab-bg no-hover" onclick="activeContactTab(0)">
  <div class="name-circle-wrapper name-in-circle0">
`;


function showContactDetails(i) {
  deleteBtn.setAttribute("onclick", `deleteContact(${i})`);
  editBtn.setAttribute("onclick", `editContact(${i})`);
}

function editContact(i) {
  saveBtn.setAttribute("onclick", `saveEditedData(${i})`);
}


function renderContacts(finalArray) {
  for (let i = 0; i < finalArray.length; i++) {
    contactsFrame.innerHTML += contactFrameHTML(initials, name, email, colorIndex, i);
  }
}


