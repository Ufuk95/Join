function tabsFrameHTML(){
  return `
  <a href="./summary.html">
    <div class="sidebar-tab tab0" onclick="changeClickedTab(0, "sidebar-tabs", tabsFrameHTML)">
      <img src="/assets/img//header_sidebar/icon_summary_grey.png" class="tab-img0" alt="">
      <span class="sidebar-text">Summary</span>
    </div>
  </a>
  <a href="./add_task.html">
    <div class="sidebar-tab tab1" onclick="changeClickedTab(1, "sidebar-tabs", tabsFrameHTML)">
      <img src="./assets/img//header_sidebar/icon_add_task_grey.png" class="tab-img1" alt="">
      <span class="sidebar-text">Add Task</span>
    </div>
  </a>
  <a href="./board.html"></a>
  <div class="sidebar-tab tab2" onclick="changeClickedTab(2)">
    <img src="./assets/img//header_sidebar/icon_board_grey.png" class="tab-img2" alt="">
    <span class="sidebar-text">Board</span>
  </div>
  </a>
  <a href="./contacts.html">
    <div class="sidebar-tab tab3" onclick="changeClickedTab(3)">
      <img src="./assets/img//header_sidebar/icon_contacts_grey.png" class="tab-img3" alt="">
      <span class="sidebar-text">Contacts</span>
    </div>
  </a>  `
}