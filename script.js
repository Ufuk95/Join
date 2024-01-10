let mobileView = false

async function loadAll() {
  await includeHTML();
  let currentPage = document.body.id;
  tabsFrame = document.getElementById(`sidebar-tabs`)
  init()
}

function init(){
  console.log(document.querySelector(`.tab0`));
}


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

let whiteImageCorrespondends = {
  0: "./assets/img/header_sidebar/icon_summary_white.png",
  1: "./assets/img/header_sidebar/icon_add_task_white.png",
  2: "./assets/img/header_sidebar/icon_board_white.png",
  3: "./assets/img/header_sidebar/icon_contacts_white.png"
};


function renderTabsFrame(tabsFrameID, tabsFrameHTML){
  let tabsFrame = document.getElementById(tabsFrameID);
  tabsFrame.innerHTML = "";
  tabsFrame.innerHTML = tabsFrameHTML();
}


/**
 * Changes the appearance of the clicked tab and updates the sidebar content..
 * @param {number} i - Index of the clicked tab.
 */
function changeClickedTab(tabIndex, tabsFrameID, tabsFrameHTML, mobileViewState) {
  mobileView = mobileViewState
  renderTabsFrame(tabsFrameID, tabsFrameHTML)
  let clickedTab = document.querySelector(`.tab${tabIndex}`);
  console.log(tabIndex);
  console.log(clickedTab);
  clickedTab.style.color = "white";
  clickedTab.style.backgroundColor = "#091931";
  let clickedTabImg = document.querySelector(`.tab-img${tabIndex}`);
  clickedTabImg.src = whiteImageCorrespondends[tabIndex];
}



