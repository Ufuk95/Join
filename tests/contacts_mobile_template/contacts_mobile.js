function startAnimation() { 
  let mobileCard = document.querySelector(`.add-contact-frame-mobile`);
  mobileCard.classList.add("transition");
  // mobileCard.classList.remove("transition")
  setTimeout(removeTransition,  1000 );


}

function removeTransition() {
  let mobileCard = document.querySelector(`.add-contact-frame-mobile`);
  mobileCard.classList.remove("transition")
}