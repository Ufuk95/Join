function sideBarTabsHTML(){
  return `
  <a href="./summary.html">
    <div id="sidebar-tab" class="tab0" onclick="changeClickedTab(0)">
      <img src="/assets/img//header_sidebar/icon_summary_grey.png" id="tab-img0" alt="">
      <span id="sidebar-text">Summary</span>
    </div>
  </a>
  <a href="./add_task.html">
    <div id="sidebar-tab" class="tab1" onclick="changeClickedTab(1)">
      <img src="./assets/img//header_sidebar/icon_add_task_grey.png" id="tab-img1" alt="">
      <span id="sidebar-text">Add Task</span>
    </div>
  </a>
  <div id="sidebar-tab" class="tab2" onclick="changeClickedTab(2)">
    <img src="./assets/img//header_sidebar/icon_board_grey.png" id="tab-img2" alt="">
    <span id="sidebar-text">Board</span>
  </div>
  <div id="sidebar-tab" class="tab3" onclick="changeClickedTab(3)">
    <img src="./assets/img//header_sidebar/icon_contacts_grey.png" id="tab-img3" alt="">
    <span id="sidebar-text">Contacts</span>
  </div>
  `
}