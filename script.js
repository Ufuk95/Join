async function includeHTML() {
  let includeElements = document.querySelectorAll('[w3-include-html]');
  for (let i = 0; i < includeElements.length; i++) {
    const element = includeElements[i];
    file = element.getAttribute("w3-include-html");
    // "includes/header.html"
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
}

function changeClickedTab(i) {
  let sideBarTabs = document.getElementById(`sidebar-tabs`);
  sideBarTabs.innerHTML = "";
  sideBarTabs.innerHTML = sideBarTabsHTML();
  let clickedTab = document.querySelector(`.tab${i}`);
  clickedTab.style.color = "white";
  clickedTab.style.backgroundColor =  "#091931"
  let clickedTabImg = document.getElementById(`tab-img${i}`);
  clickedTabImg.src = whiteImageCorrespondends[i];
}