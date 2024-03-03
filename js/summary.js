let counter = {
  "todo": 0,
  "done": 0,
  "urgent": 0,
  "total-tasks": 0,
  "in-progress": 0,
  "await-feedback": 0,
};


async function summaryInit() {
  dataInfo = JSON.parse(await getItem("board_key"));
  loadAll();
  getCounters();
}

let dataInfo;
function getArray(key) { return JSON.parse(localStorage.getItem(key)); }
function setArray(key, array) { localStorage.setItem(key, JSON.stringify(array)); }

let myUser = getArray("loggedInUser");

document.getElementById(`person-name`).innerHTML = myUser["name"].split(" ")[0];


/**
 * Names of ids needed to be filled with counters. 
 *
 * urgent-counter --> class
 * id="todo-count"
 * id="done-count"
 * id="count-tasks"
 * id="count-in-progress"
 * id="count-await-feedback"
 */

let boardColumns = {
  "1": "todo",
  "2": "in-progress",
  "3": "await-feedback",
  "4": "done",
};

let objectMagic = Object.keys(boardColumns);
console.log(objectMagic);
console.log(objectMagic.length);

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
  console.log(counter);
}
