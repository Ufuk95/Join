function sideBarTabsHTML(){
  return `
  <div id="sidebar-tab" class="tab0" onclick="changeClickedTab(0)">
  <img src="/assets/img//header_sidebar/icon_summary_grey.png" id="tab-img0" alt="">
  <span id="sidebar-text">Summary</span>
</div>
<div id="sidebar-tab" class="tab1" onclick="changeClickedTab(1)">
  <img src="/assets/img//header_sidebar/icon_add_task_grey.png" alt="">
  <span id="sidebar-text">Add Task</span>
</div>
<a href="./board.html">
<div id="sidebar-tab" class="tab2" onclick="changeClickedTab(2)">
  <img src="/assets/img//header_sidebar/icon_board_grey.png" alt="">
  <span id="sidebar-text">Board</span>
</div>
</a>
<div id="sidebar-tab" class="tab3" onclick="changeClickedTab(3)">
  <img src="/assets/img//header_sidebar/icon_contacts_grey.png" alt="">
  <span id="sidebar-text">Contacts</span>
</div>
  `
}