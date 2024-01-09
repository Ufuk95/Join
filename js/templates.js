function tabsFrameHTML(){
  return `
  <a href="./summary.html">
    <div class="sidebar-tab tab0" onclick="changeClickedTab(0, "sidebar-tabs", tabsFrameHTML, false)">
      <img src="/assets/img//header_sidebar/icon_summary_grey.png" class="tab-img0" alt="">
      <span class="sidebar-text">Summary</span>
    </div>
  </a>
  <a href="./add_task.html">
    <div class="sidebar-tab tab1" onclick="changeClickedTab(1, "sidebar-tabs", tabsFrameHTML, false)">
      <img src="./assets/img//header_sidebar/icon_add_task_grey.png" class="tab-img1" alt="">
      <span class="sidebar-text">Add Task</span>
    </div>
  </a>
  <a href="./board.html"></a>
  <div class="sidebar-tab tab2" onclick="changeClickedTab(2, "sidebar-tabs", tabsFrameHTML, false)">
    <img src="./assets/img//header_sidebar/icon_board_grey.png" class="tab-img2" alt="">
    <span class="sidebar-text">Board</span>
  </div>
  </a>
  <a href="./contacts.html">
    <div class="sidebar-tab tab3" onclick="changeClickedTab(3, "sidebar-tabs", tabsFrameHTML, false)">
      <img src="./assets/img//header_sidebar/icon_contacts_grey.png" class="tab-img3" alt="">
      <span class="sidebar-text">Contacts</span>
    </div>
  </a> `
}

function footerFrameHTML(){
  return `
  <a href="./summary.html">
  <div class="footer-square tab0" onclick="changeClickedTab(0, "nav-footer", footerFrameHTML)">
    <div class="icon-text-box">
      <img src="./assets/img/header_sidebar/icon_summary_grey.png" alt="">
      <span class="footer-square-text">Summary</span>
    </div>
  </div>
</a>
<a href="./board.html">
  <div class="footer-square tab1" onclick="changeClickedTab(1, "nav-footer", footerFrameHTML)">
    <div class="icon-text-box">
      <img src="./assets/img/header_sidebar/icon_board_grey.png" alt="">
      <span class="footer-square-text">Board</span>
    </div>
  </div>
</a>
<a href="./add_task.html">
  <div class="footer-square tab2" onclick="changeClickedTab(2, "nav-footer", footerFrameHTML)">
    <div class="icon-text-box">
      <img src="./assets/img/header_sidebar/icon_add_task_grey.png" alt="">
      <span class="footer-square-text">Add-Task</span>
    </div>
  </div>
</a>
<a href="./contacts.html">
  <div class="footer-square tab3" onclick="changeClickedTab(3, "nav-footer", footerFrameHTML)">
    <div class="icon-text-box">
      <img src="./assets/img/header_sidebar/icon_contacts_grey.png" alt="">
      <span class="footer-square-text">Contacts</span>
    </div>
  </div>
</a>
  `
}