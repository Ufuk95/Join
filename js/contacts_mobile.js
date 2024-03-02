function getContactDetailElementsMobile() {
  return {
    contactEclipse: document.getElementById(`contact-infos-mobile__eclipse`),
    contactName: document.getElementById(`contact-infos-mobile__name`),
    contactMail: document.getElementById(`contact-infos-mobile__email`),
    contactPhone: document.getElementById(`contact-infos-mobile__phone`),
  };
}


/**
 * Shows the contact details in the mobile version. 
 */
function showContactDetailsMobile(i) {
  let { contactEclipse, contactName, contactMail, contactPhone } = getContactDetailElementsMobile();
  let colorNumber = calculateColorMap(i);
  let initials = finalArray[i][2];
  contactEclipse.innerHTML = circleNameTemplate(i, colorNumber, initials);
  contactName.innerHTML = finalArray[i][0];
  contactMail.innerHTML = finalArray[i][1];
  contactPhone.innerHTML = finalArray[i][3];
  document.querySelector(`.more-options-circle`).classList.remove("d-none");
  let deleteBtn = document.querySelector(`.delete-contact`);
  let editBtn = document.querySelector(`.edit-contact`);
  deleteBtn.setAttribute("onclick", `deleteContact(${i})`);
  editBtn.setAttribute("onclick", `editContactMobile(${i})`);
}


/**
 * Executes on clicking the blue back arrow. Handles visibility of some elements. 
 */
function blueBackArrowMobile() {
  document.getElementById(`contacts-frame`).classList.remove("d-none");
  document.querySelector(`.contact-infos-box__mobile`).classList.add("d-none");
  document.querySelector(`.blue-arrow-left`).classList.add("d-none");
  document.querySelector(`.mobile-add-contact-btn`).classList.remove("d-none");
  document.querySelector(`.more-options-circle`).classList.add("d-none");
  document.querySelector(`.more-options-mobile`).classList.add("d-none");
  document.querySelector(`.more-options-mobile`).classList.remove("transition");
}


/**
 * Removes unwanted mobile elements, when going back to the desktop version. 
*/
function removeUnwantedMobileElements() {
  if (window.innerWidth > 1000) {
    document.getElementById(`contacts-frame`).classList.remove("d-none");
    document.querySelector(`.contact-infos-box__mobile`).classList.add("d-none");
    document.querySelector(`.blue-arrow-left`).classList.add("d-none");
    document.querySelector(`.more-options-mobile`).classList.add("d-none");
  }
}


window.addEventListener('resize', removeUnwantedMobileElements);

function addContactMobile() {
  document.querySelector(`.dialog-bg`).classList.remove("display-none");
  let addContactFrameMobile = document.querySelector(`.add-contact-frame-mobile`);
  if (addContactFrameMobile) {
    addContactFrameMobile.remove();
  }
  document.getElementsByTagName("body")[0].innerHTML += addContactTemplateMobile();
  document.querySelector(`.add-contact-frame-mobile`).classList.add("add-contact-transition__mobile");
}


function getEditInputFieldsMobile() {
  return {
    editName: document.getElementById(`add-contact__name`),
    editEmail: document.getElementById(`ad-contact__email`),
    editPhone: document.getElementById(`ad-contact__phone`),
    deleteBtn: document.querySelector(`.cancel-btn__mobile`),
    saveBtn: document.querySelector(`.create-btn__mobile-edit`)
  };
}

function editContactMobile(i) {
  document.querySelector(`.dialog-bg`).classList.remove("display-none");
  let addContactFrameMobile = document.querySelector(`.add-contact-frame-mobile`);
  if (addContactFrameMobile) {
    addContactFrameMobile.remove();
  }
  document.querySelector(`.more-options-mobile`).classList.remove("transition")
  document.getElementsByTagName("body")[0].innerHTML += editContactTemplateMobile();
  let { editName, editEmail, editPhone, deleteBtn, saveBtn } = getEditInputFieldsMobile();
  editName.value = finalArray[i][0];
  editEmail.value = finalArray[i][1];
  editPhone.value = finalArray[i][3];
  deleteBtn.setAttribute("onclick", `deleteContact(${i})`);
  saveBtn.setAttribute("onclick", `saveEditedData(${i})`);
  document.querySelector(`.add-contact-frame-mobile`).classList.add("add-contact-transition__mobile");
  document.querySelector(`.mobile-add-contact-btn`).classList.add("d-none");
}


function moreOptionsMobile() {
  let moreOptionsBubble = document.querySelector(`.more-options-mobile`);
  moreOptionsBubble.classList.remove("d-none");
  moreOptionsBubble.classList.add("transition");
  document.querySelector(`.more-options-circle`).classList.add("d-none");
}
