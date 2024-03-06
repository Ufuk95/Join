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
  renderGreeting();
  renderUserName();
  renderCounts();
  getLatestUrgentDate()
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
  } counter["total-tasks"] = dataInfo.length;
}


/**
 * Renders the name of the current logged in user.
 */
function renderUserName() {
  let myUser = getArray("loggedInUser");
  document.getElementById(`person-name`).innerHTML = myUser["name"].split(" ")[0];
}


/**
 * Renders a user greeting, dependent on the daytime. 
 */
function renderGreeting() {
  let timeStamp = new Date();
  let currentHour = timeStamp.getHours();
  console.log(currentHour);
  let greetingElement = document.getElementById(`good-morning`);
  if (currentHour <= 12) {
    greetingElement.innerHTML = "Good Morning,";
  } else {
    greetingElement.innerHTML = "Good Afternoon,";
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


/**
 * Gets the latest urgent date and renders it into the appropriate div. 
 */
async function getLatestUrgentDate() {
  let urgentDates = [];
  dataInfo = JSON.parse(await getItem("board_key"));
  for (let i = 0; i < dataInfo.length; i++) {
    let task = dataInfo[i];
    if (task["priorityText"] === "Urgent") {
      urgentDates.push(task["date"]);
    }
  }
  let sortedDates = urgentDates.sort();
  let latestDate = sortedDates[sortedDates.length -1]
  document.getElementById(`deadline-date`).innerHTML = latestDate;
}


