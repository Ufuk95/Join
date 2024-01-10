async function loadAll() {
  await includeHTML();
  let currentPage = Number(document.body.id);
  clearTabStyles();
  changeClickedTab(currentPage);
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

function clearTabStyles() {
  let tabList = document.querySelectorAll(`.single-tab`);
  tabList.forEach(tab => { tab.style.color = "#CDCDCD", tab.style.backgroundColor = "#2A3647"; });
}

function changeClickedTab(tabIndex) {
  let clickedTab = document.querySelectorAll(`.tab${tabIndex}`);
  clickedTab.forEach(tab => {tab.style.color = "white", tab.style.backgroundColor = "#091931"} )
  let tabImg = document.querySelectorAll(`.tab-img${tabIndex}`);
  tabImg.forEach(img => {img.src = whiteImageCorrespondends[tabIndex]})
}

/**
 * Changes the appearance of the clicked tab and updates the sidebar content..
 * @param {number} i - Index of the clicked tab.
 */
// function changeClickedTab(tabIndex) {
//   let clickedTab = document.querySelector(`.tab${tabIndex}`);
//   console.log(tabIndex);
//   console.log(clickedTab);
//   clickedTab.style.color = "white";
//   clickedTab.style.backgroundColor = "#091931";
//   let clickedTabImg = document.querySelector(`.tab-img${tabIndex}`);
//   clickedTabImg.src = whiteImageCorrespondends[tabIndex];
// }



