function contactFrameHTML(initials, name, email, colorNumber, i){
  return`
  <div class="contact-frame contact-frame${i}" onclick="activeContactTab(${i})">
  <div class="name-circle-wrapper">
    <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle  cx="21" cy="21" r="20" fill=${colorCarousell[colorNumber]} stroke="white" stroke-width="2" />
    </svg>
    <span class="initials">${initials}</span>
  </div>
  <div class="name-email-box">
    <span class="name-email-box__name">${name}</span>
    <span class="name-email-box__mail">${email}</span>
  </div>
  </div>
  `
}

function singleLetterAndStrokeHTML(singleLetter, i){
  return `
  <div class="single-letter-box letter${i}">
  <span class="single-letter-box__txt">${singleLetter}</span>
  </div>
  <svg width="354" height="2" viewBox="0 0 354 2" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M1 1H353" stroke="#D1D1D1" stroke-linecap="round" />
  </svg>
  ` 
}

// ! all of that has to go into contacts. Whereby single-letter box depends if there are already
// ! names beginning with that letter. 

