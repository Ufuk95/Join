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
  contactEclipse.innerHTML = document.querySelector(`.name-in-circle${i}`).innerHTML;
  contactName.innerHTML = document.querySelector(`.name${i}`).innerHTML;
  contactMail.innerHTML = document.querySelector(`.mail${i}`).innerHTML;
  contactPhone.innerHTML = finalArray[i][3];
  let deleteBtn = document.querySelector(`.delete-contact`)
  let editBtn = document.querySelector(`.edit-contact`)
  deleteBtn.setAttribute("onclick", `deleteContact(${i})`);
  editBtn.setAttribute("onclick", `editContact(${i})`);

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
  document.querySelector(`.more-options-mobile`).classList.add("d-none")
  document.querySelector(`.more-options-mobile`).classList.remove("transition")
}


/**
 * Removes unwanted mobile elements, when going back to the desktop version. 
 */
function removeUnwantedMobileElements() {
  if (window.innerWidth > 1000) {
    document.getElementById(`contacts-frame`).classList.remove("d-none");
    document.querySelector(`.contact-infos-box__mobile`).classList.add("d-none");
    document.querySelector(`.blue-arrow-left`).classList.add("d-none");
  }
}

function addContactMobile() {
  document.querySelector(`.dialog-bg`).classList.remove("display-none");
  let addContactFrameMobile = document.querySelector(`.add-contact-frame-mobile`);
  if (addContactFrameMobile) {
    addContactFrameMobile.remove();
  }
  document.getElementsByTagName("body")[0].innerHTML += addContactTemplateMobile();
  document.querySelector(`.add-contact-frame-mobile`).classList.add("add-contact-transition__mobile");
}


function editContactMobile(){
  document.querySelector(`.dialog-bg`).classList.remove("display-none");
  let addContactFrameMobile = document.querySelector(`.add-contact-frame-mobile`);
  if (addContactFrameMobile) {
    addContactFrameMobile.remove();
  }
  document.getElementsByTagName("body")[0].innerHTML += editContactTemplateMobile();
  document.querySelector(`.add-contact-frame-mobile`).classList.add("add-contact-transition__mobile");
}

function deleteContactMobile(){
  console.log("delete working");
}

function moreOptionsMobile() {
  let moreOptionsBubble = document.querySelector(`.more-options-mobile`);
  moreOptionsBubble.classList.remove("d-none");
  moreOptionsBubble.classList.add("transition");

}

window.addEventListener('resize', removeUnwantedMobileElements);