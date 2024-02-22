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
}


/**
 * Executes on clicking the blue back arrow. Handles visibility of some elements. 
 */
function blueBackArrowMobile() {
  document.getElementById(`contacts-frame`).classList.remove("d-none");
  document.querySelector(`.contact-infos-box__mobile`).classList.add("d-none");
  document.querySelector(`.blue-arrow-left`).classList.add("d-none");
  document.querySelector(`.mobile-add-contact-btn`).classList.remove("d-none")
  document.querySelector(`.more-options-circle`).classList.add("d-none")
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

window.addEventListener('resize', removeUnwantedMobileElements);