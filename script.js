async function loadAll() {
  await includeHTML();
  let currentPage = document.body.id;
  tabsFrame = document.getElementById(`sidebar-tabs`)
  console.log(tabsFrame);
  changeClickedTab(Number(currentPage));
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


/**
 * Changes the appearance of the clicked tab and updates the sidebar content.
 * d
 * @param {number} i - Index of the clicked tab.
 */
function changeClickedTab(i) {
  let tabsFrame = document.getElementById(`sidebar-tabs`);
  console.log(tabsFrame);
  tabsFrame.innerHTML = "";
  tabsFrame.innerHTML = tabsFrameHTML();
  let clickedTab = document.querySelector(`.tab${i}`);
  clickedTab.style.color = "white";
  clickedTab.style.backgroundColor = "#091931";
  let clickedTabImg = document.getElementById(`tab-img${i}`);
  clickedTabImg.src = whiteImageCorrespondends[i];
}


