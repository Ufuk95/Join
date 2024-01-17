async function loadAll() {
  await includeHTML();
  let currentPage = Number(document.body.id);
  clearTabStyles();
  changeClickedTab(currentPage);
}

async function includeHTML() {
  const headerResponse = await fetch('./assets/templates/header.html');
  const headerHTML = await headerResponse.text();
  const headerElement = document.getElementById('header');
  if (headerElement) {
      headerElement.innerHTML = headerHTML;
  } else {
      console.error('Header element not found.');
  }

  const sidebarResponse = await fetch('./assets/templates/sidebar.html');
  const sidebarHTML = await sidebarResponse.text();
  const sidebarElement = document.getElementById('sidebar');
  if (sidebarElement) {
      sidebarElement.innerHTML = sidebarHTML;
  } else {
      console.error('Sidebar element not found.');
  }
}

let whiteImageCorrespondends = {
  0: "./assets/img/header_sidebar/icon_summary_white.png",
  1: "./assets/img/header_sidebar/icon_add_task_white.png",
  2: "./assets/img/header_sidebar/icon_board_white.png",
  3: "./assets/img/header_sidebar/icon_contacts_white.png"
};

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




