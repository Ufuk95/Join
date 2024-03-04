let boardColumns = {
  "0": "todo",
  "1": "in-progress",
  "2": "await-feedback",
  "3": "done",
};

let counter = {
  "todo": 0,
  "done": 0,
  "urgent": 0,
  "total-tasks": 0,
  "in-progress": 0,
  "await-feedback": 0,
};

let dataInfo;

/**
 * summary.html initializer
 */
async function summaryInit() {
  dataInfo = JSON.parse(await getItem("board_key"));
  loadAll();
  getCounters();
  renderUserName()
  renderCounts();
}


/**
 * Renders the name of the current logged in user.
 */
function renderUserName(){
  let myUser = getArray("loggedInUser");
  document.getElementById(`person-name`).innerHTML = myUser["name"].split(" ")[0];
}


/**
 * Gets counts of the board key metrics. 
 */
function getCounters() {
  for (let i = 0; i < dataInfo.length; i++) {
    let taskIfnos = dataInfo[i];
    for (let j = 0; j < Object.keys(boardColumns).length; j++) {
      let columnName = boardColumns[j];
      if (taskIfnos["field"] === columnName) {
        counter[columnName] += 1;
      }
    }
    if (taskIfnos["priorityText"] === "Urgent") {
      counter["urgent"] += 1;
    }
  }
}


/**
 * Renders all counts into the related divs. 
 */
function renderCounts() {
  document.getElementById(`todo-count`).innerHTML = counter["todo"];
  document.getElementById(`done-count`).innerHTML = counter["done"];
  document.querySelector(`.urgent-counter`).innerHTML = counter["urgent"];
  document.getElementById(`count-tasks`).innerHTML = counter["total-tasks"];
  document.getElementById(`count-in-progress`).innerHTML = counter["in-progress"];
  document.getElementById(`count-await-feedback`).innerHTML = counter["await-feedback"];
}