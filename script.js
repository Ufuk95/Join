let whiteImageCorrespondends = {
  0: "./assets/img/header_sidebar/icon_summary_white.png",
  1: "./assets/img/header_sidebar/icon_add_task_white.png",
  2: "./assets/img/header_sidebar/icon_board_white.png",
  3: "./assets/img/header_sidebar/icon_contacts_white.png"
};

/**
 * Loads the templates and user Initials. 
 */
async function loadAll() {
  await includeHTML();
  let currentPage = Number(document.body.id);
  clearTabStyles();
  changeClickedTab(currentPage);
  renderUserInitials();
}


function getArray(key) { return JSON.parse(localStorage.getItem(key)); }
function setArray(key, array) { localStorage.setItem(key, JSON.stringify(array)); }


async function includeHTML() {
  let includeElements = document.querySelectorAll('[w3-include-html]');
  for (let i = 0; i < includeElements.length; i++) {
    const element = includeElements[i];
    file = element.getAttribute("w3-include-html");
    let resp = await fetch(file);
    if (resp.ok) {
      element.innerHTML = await resp.text();
    } else {
      element.innerHTML = 'Page not found';
    }
  }
}


/**
 * Renders the logged in users initials in the top right corner. 
 */
function renderUserInitials() {
  let userInitialsElement = document.querySelector(`.user-initials`);
  let currentUser = getArray("loggedInUser");
  userInitialsElement.innerHTML = currentUser["initials"];
}


function showLegalNoticeBubble() {
  document.querySelector(`.legal-notice-bubble`).classList.toggle("display-none");
}

/**
 * Simulates a user log out. Clears the name and initials
 */
function logOutUser() {
  let userLogInObject = getArray("loggedInUser");
  userLogInObject["name"] = "";
  userLogInObject["initials"] = "";
  setArray("loggedInUser", userLogInObject)
  window.location.href = "./logIn.html";
}


/**
 * Resets the tab styling for the sidebar-tabs and the footer-tabs
 */
function clearTabStyles() {
  let tabList = document.querySelectorAll(`.single-tab`);
  tabList.forEach(tab => { tab.style.color = "#CDCDCD", tab.style.backgroundColor = "#2A3647"; });
}


/**
 * Changes the styling of a clicked tab. 
 * @param {number} tabIndex index of the clicked tab.  
 */
function changeClickedTab(tabIndex) {
  let clickedTab = document.querySelectorAll(`.tab${tabIndex}`);
  clickedTab.forEach(tab => { tab.style.color = "white", tab.style.backgroundColor = "#091931"; });
  let tabImg = document.querySelectorAll(`.tab-img${tabIndex}`);
  tabImg.forEach(img => { img.src = whiteImageCorrespondends[tabIndex]; });
}





