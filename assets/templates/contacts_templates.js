

function contactButtonHTML() {
  return `
  <div id="contacts-button-wrapper">
  <div id="contacts-btn" onclick="addNewContactBtn()">
    <span id="contacts-btn__txt">
      Add new contact
    </span>
    <img src="./assets/img/contacts/add_new_contact.png" alt="">
  </div>
</div>

  `;
}


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


function circleNameTemplate(i, colorNumber, initials) {
  return `
  <svg width="45" height="45" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle  cx="21" cy="21" r="20" fill=${colorCarousell[colorNumber]} stroke="white" stroke-width="2" />
  </svg>
  <span class="initials initials${i}">${initials}</span>
  `;
}


function singleLetterAndStrokeHTML(singleLetter, i) {
  return `
  <div class="single-letter-box letter${i}">
  <span class="single-letter-box__txt">${singleLetter}</span>
  </div>
  <svg width="354" height="2" viewBox="0 0 354 2" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M1 1H353" stroke="#D1D1D1" stroke-linecap="round" />
  </svg>
  `;
}

function addContactTemplate() {
  return `
  <div class="add-contact-frame__left">
  <div class="add-contact__left-content">
    <img id="logo-join" src="./assets/img/contacts/join_logo.svg" alt="">
    <div class="left-content__header">Add Contact</div>
    <div class="left-content__slogan">Tasks are better with a team</div>
    <img id="blue-stroke" src="./assets/img/contacts/blue_stroke_horizontal.svg" alt="">
  </div>
</div>
<!---------------------- ADD CONTACT RIGHT SIDE ---------------------->
<div class="add-contact-frame__right">
  <div id="close-x__wrapper">
    <div id="enclosing-circle" onclick="navigateBack()">
      <img id="close-x" src="./assets/img/contacts/close_x.svg" alt="">
    </div>
  </div>
  <div class="add-contact-form__wrapper">
    <div class="add-contact__img-placeholder">
      <img src="./assets/img/contacts/person_in_circle.svg" class="person-img" alt="">
    </div>
    <form class="add-contact__form" onsubmit="getContactData('add-contact__name', 'add-contact__email', 'add-contact__phone'); return false">
      <div class="input-fields-frame">
        <div class="input-field__box">
          <input id="add-contact__name" type="text" required class="input-field" placeholder="Name" autocomplete="off">
          <img src="./assets/img/contacts/icon_person.png" class="input-field__img-placing" alt="">
        </div>
        <div class="input-field__box">
          <input id="add-contact__email" type="email" required class="input-field" placeholder="Email" autocomplete="off">
          <img src="./assets/img/contacts/icon_mail.png" class="input-field__img-placing" alt="">
        </div>
        <div class="input-field__box">
          <input id="add-contact__phone" type="tel" required class="input-field" placeholder="Phone" autocomplete="off">
          <img src="./assets/img/contacts/icon_phone.svg" class="input-field__img-placing" alt="">
        </div>

        <div class="form-btns-frame">
          <div class="cancel-btn" onclick="navigateBack()">
            <div class="cancel-btn__content">
              <span class="cancel-txt">Cancel</span>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <mask id="mask0_71720_5528" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="4" y="4" width="24" height="24">
                <rect  x="4" y="4" width="24" height="24" fill="#D9D9D9"/>
                </mask>
                <g mask="url(#mask0_71720_5528)">
                <path class="x-fill" d="M16 17.4L11.1 22.3C10.9167 22.4834 10.6834 22.575 10.4 22.575C10.1167 22.575 9.88338 22.4834 9.70005 22.3C9.51672 22.1167 9.42505 21.8834 9.42505 21.6C9.42505 21.3167 9.51672 21.0834 9.70005 20.9L14.6 16L9.70005 11.1C9.51672 10.9167 9.42505 10.6834 9.42505 10.4C9.42505 10.1167 9.51672 9.88338 9.70005 9.70005C9.88338 9.51672 10.1167 9.42505 10.4 9.42505C10.6834 9.42505 10.9167 9.51672 11.1 9.70005L16 14.6L20.9 9.70005C21.0834 9.51672 21.3167 9.42505 21.6 9.42505C21.8834 9.42505 22.1167 9.51672 22.3 9.70005C22.4834 9.88338 22.575 10.1167 22.575 10.4C22.575 10.6834 22.4834 10.9167 22.3 11.1L17.4 16L22.3 20.9C22.4834 21.0834 22.575 21.3167 22.575 21.6C22.575 21.8834 22.4834 22.1167 22.3 22.3C22.1167 22.4834 21.8834 22.575 21.6 22.575C21.3167 22.575 21.0834 22.4834 20.9 22.3L16 17.4Z" fill="#2A3647"/>
                </g>
                </svg>
            </div>
          </div>
          <button class="create-btn">
            <div class="create-btn__content">
              <span class="create-btn__txt">Create Contact</span>
              <img src="./assets/img/contacts/check_mark.svg" alt="">
            </div>
          </button>
        </div>
      </div>
    </form>
  </div>
</div>

  `;
}

function editContactTemplate() {
  return `
  <div class="add-contact-frame__left">
  <div class="add-contact__left-content">
    <img id="logo-join" src="./assets/img/contacts/join_logo.svg" alt="">
    <div class="left-content__header">Edit Contact</div>
    <img id="blue-stroke" src="./assets/img/contacts/blue_stroke_horizontal.svg" alt="">
  </div>
</div>
<!---------------------- ADD CONTACT RIGHT SIDE ---------------------->
<div class="add-contact-frame__right">
  <div id="close-x__wrapper">
    <div id="enclosing-circle" onclick="navigateBack()">
      <img id="close-x" src="./assets/img/contacts/close_x.svg" alt="">
    </div>
  </div>
  <div class="add-contact-form__wrapper">
    <div class="add-contact__img-placeholder">
      <img src="./assets/img/contacts/person_in_circle.svg" class="person-img" alt="">
    </div>
    <form class="add-contact__form" onsubmit="return false">
      <div class="input-fields-frame">
        <div class="input-field__box">
          <input id="add-contact__name" type="text" required class="input-field edit-name" placeholder="Name" autocomplete="off">
          <img src="./assets/img/contacts/icon_person.png" class="input-field__img-placing" alt="">
        </div>
        <div class="input-field__box">
          <input id="ad-contact__email" type="email" required class="input-field edit-email" placeholder="Email" autocomplete="off">
          <img src="./assets/img/contacts/icon_mail.png" class="input-field__img-placing" alt="">
        </div>
        <div class="input-field__box">
          <input id="ad-contact__phone" type="tel" required class="input-field edit-phone" placeholder="Phone" autocomplete="off">
          <img src="./assets/img/contacts/icon_phone.svg" class="input-field__img-placing" alt="">
        </div>

        <div class="form-btns-frame">
          <div class="cancel-btn" onclick="navigateBack()">
            <div class="cancel-btn__content">
              <span class="cancel-txt">Delete</span>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <mask id="mask0_71720_5528" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="4" y="4" width="24" height="24">
                <rect  x="4" y="4" width="24" height="24" fill="#D9D9D9"/>
                </mask>
                <g mask="url(#mask0_71720_5528)">
                <path class="x-fill" d="M16 17.4L11.1 22.3C10.9167 22.4834 10.6834 22.575 10.4 22.575C10.1167 22.575 9.88338 22.4834 9.70005 22.3C9.51672 22.1167 9.42505 21.8834 9.42505 21.6C9.42505 21.3167 9.51672 21.0834 9.70005 20.9L14.6 16L9.70005 11.1C9.51672 10.9167 9.42505 10.6834 9.42505 10.4C9.42505 10.1167 9.51672 9.88338 9.70005 9.70005C9.88338 9.51672 10.1167 9.42505 10.4 9.42505C10.6834 9.42505 10.9167 9.51672 11.1 9.70005L16 14.6L20.9 9.70005C21.0834 9.51672 21.3167 9.42505 21.6 9.42505C21.8834 9.42505 22.1167 9.51672 22.3 9.70005C22.4834 9.88338 22.575 10.1167 22.575 10.4C22.575 10.6834 22.4834 10.9167 22.3 11.1L17.4 16L22.3 20.9C22.4834 21.0834 22.575 21.3167 22.575 21.6C22.575 21.8834 22.4834 22.1167 22.3 22.3C22.1167 22.4834 21.8834 22.575 21.6 22.575C21.3167 22.575 21.0834 22.4834 20.9 22.3L16 17.4Z" fill="#2A3647"/>
                </g>
                </svg>
            </div>
          </div>
          <button class="create-btn save-btn">
            <div class="create-btn__content">
              <span class="create-btn__txt">Save</span>
              <img src="./assets/img/contacts/check_mark.svg" alt="">
            </div>
          </button>
        </div>
      </div>
    </form>
  </div>
</div>
 `;
}


function nameEclipse(nameEclipse) {
  return `
  <div id="contact-infos__eclipse" class="margin-auto">${nameEclipse}</div>
  `;
}


function contactInfosMobile() {
  return `
  <div class="contact-infos-box__mobile display-none">
    <div id="contact-infos-mobile__name-eclipse">
      <div id="contact-infos-mobile__eclipse"></div>
      <div id="contact-infos-mobile__name"></div>
    </div>
    <div id="contact-information__mobile">Contact Information</div>
    <div id="contact-infos-mobile__email-phone-frame">
      <div id="contact-infos-mobile__email-frame">
        <div id="contact-infos-mobile__email-txt">Email</div>
        <div id="contact-infos-mobile__email"></div>
      </div>
      <div id="contact-infos-mobile__phone-frame">
        <div id="contact-infos-mobile__phone-txt">Phone</div>
        <div id="contact-infos-mobile__phone"></div>
      </div>
    </div>
  </div>
  
  `;
}


function addContactTemplateMobile() {
  return `
  <div class="add-contact-frame-mobile">
  <div class="add-contact-mobile__top">
    <img class="person-circle" src="./assets/img/contacts/person_in_circle.svg" alt="">
    <div class="close-x__wrapper">
        <img id="close-x" onclick="navigateBack()" src="./assets/img/contacts/close_x_white.svg" alt="">
    </div>
    <div class="add-contact-mobile__slogan-frame">
      <div class="add-contact-mobile__slogan-header">Add contact</div>
      <div class="add-contact-mobile__slogan-txt">Tasks are better with a team!</div>
      <div class="blue-stroke-horizontal"></div>
    </div>
  </div>
  <div class="add-contact-mobile__bottom">
    <form class="add-contact__mobile-form" onsubmit="getContactData('add-contact__name-mobile', 'add-contact__email-mobile', 'add-contact__phone-mobile'); return false">
      <div class="input-fields-mobile__add-task">
        <div class="input-field__box">
          <input id="add-contact__name-mobile" type="text" required class="input-field__mobile edit-name" placeholder="Name"
            autocomplete="off">
          <img src="./assets/img/contacts/icon_person.png" class="input-field__img-placing" alt="">
        </div>
        <div class="input-field__box">
          <input id="add-contact__email-mobile" type="email" required class="input-field__mobile edit-email" placeholder="Email"
            autocomplete="off">
          <img src="./assets/img/contacts/icon_mail.png" class="input-field__img-placing" alt="">
        </div>
        <div class="input-field__box">
          <input id="add-contact__phone-mobile" type="tel" required class="input-field__mobile edit-phone" placeholder="Phone"
            autocomplete="off">
          <img src="./assets/img/contacts/icon_phone.svg" class="input-field__img-placing" alt="">
        </div>
      </div>
      <button class="create-btn__mobile">
      <div class="create-btn__content">
        <span class="create-btn__txt">Create Contact</span>
        <img src="./assets/img/contacts/check_mark.svg" alt="">
      </div>
    </button>
    </form>
  </div>
</div>
  `;
}


function editContactTemplateMobile() {
  return `
  <div class="add-contact-frame-mobile">
  <div class="add-contact-mobile__top">
    <img class="person-circle" src="./assets/img/contacts/person_in_circle.svg" alt="">
    <div class="close-x__wrapper">
      <img id="close-x" src="./assets/img/contacts/close_x_white.svg" onclick="navigateBack()" alt="">
    </div>
    <div class="add-contact-mobile__slogan-frame">
      <div class="add-contact-mobile__slogan-header">Edit contact</div>
      <div class="blue-stroke-horizontal"></div>
    </div>
  </div>
  <div class="add-contact-mobile__bottom">
    <form class="add-contact__mobile-form" onsubmit="return false">
      <div class="input-fields-mobile__add-task">
        <div class="input-field__box">
          <input id="add-contact__name" type="text" required class="input-field__mobile edit-name" placeholder="Name"
            autocomplete="off">
          <img src="./assets/img/contacts/icon_person.png" class="input-field__img-placing" alt="">
        </div>
        <div class="input-field__box">
          <input id="ad-contact__email" type="email" required class="input-field__mobile edit-email"
            placeholder="Email" autocomplete="off">
          <img src="./assets/img/contacts/icon_mail.png" class="input-field__img-placing" alt="">
        </div>
        <div class="input-field__box">
          <input id="ad-contact__phone" type="tel" required class="input-field__mobile edit-phone" placeholder="Phone"
            autocomplete="off">
          <img src="./assets/img/contacts/icon_phone.svg" class="input-field__img-placing" alt="">
        </div>
      </div>
    </form>
    <div class="form-btns-frame__mobile">
      <div class="cancel-btn__mobile" onclick="navigateBack()">
        <div class="cancel-btn-content__mobile">
          <span class="cancel-txt__mobile">Delete</span>
        </div>
      </div>
      <button class="create-btn__mobile-edit" onclick = "saveEditedData(i)">
        <div class="create-btn__content">
          <span class="create-btn__txt">Save</span>
          <img src="./assets/img/contacts/check_mark.svg" alt="">
        </div>
      </button>
    </div>
  </div>
  `;
}
// ! all of that has to go into contacts. Whereby single-letter box depends if there are already
// ! names beginning with that letter. 

