


async function summaryInit() {
  dataInfo = JSON.parse(await getItem("board_key"));
  loadAll();
  getCounters();
  renderCounts();
}

let dataInfo;
function getArray(key) { return JSON.parse(localStorage.getItem(key)); }
function setArray(key, array) { localStorage.setItem(key, JSON.stringify(array)); }

let myUser = getArray("loggedInUser");

document.getElementById(`person-name`).innerHTML = myUser["name"].split(" ")[0];



let boardColumns = {
  "0": "todo",
  "1": "in-progress",
  "2": "await-feedback",
  "3": "done",
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


let counter = {
  "todo": 0,
  "done": 0,
  "urgent": 0,
  "total-tasks": 0,
  "in-progress": 0,
  "await-feedback": 0,
};


function renderCounts() {
  document.getElementById(`todo-count`).innerHTML = counter["todo"];
  document.getElementById(`done-count`).innerHTML = counter["done"];
  document.querySelector(`.urgent-counter`).innerHTML = counter["urgent"];
  document.getElementById(`count-tasks`).innerHTML = counter["total-tasks"];
  document.getElementById(`count-in-progress`).innerHTML = counter["in-progress"];
  document.getElementById(`count-await-feedback`).innerHTML = counter["await-feedback"];
}