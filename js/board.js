const tasks = [];
let currentDraggedElement;
let currentPriority = null;

function updateHTML() {
  ["todo", "in-progress", "await-feedback", "done"].forEach(updateArea);
}

function updateArea(field) {
  const filteredTasks = tasks.filter((t) => t["field"] === field);
  const areaElement = document.getElementById(field);
  areaElement.innerHTML = filteredTasks.map(generateTaskHTML).join("");
}

function startDragging(id) {
  currentDraggedElement = id;
}

function generateTaskHTML(element) {
  return `
    <div data-id="${element.id}" draggable="true" ondragstart="startDragging(${element.id})" class="task">
        <div class="kanban-title">
            <b>${element.title}</b>
        </div>
        <div>
            <p class="description-font">${element.description}</p>
        </div>
        <div class="progress-task">
            <div class="progressbar"></div>
            <div class="subtask-display">0/0 Subtasks</div>
        </div>
        <div>
        <!-- <span>${element.contacts}</span> -->
            <img id="priority" src="${element.priority}" alt="Priority">
        </div> 
    </div>`;
}

// Annahme: board ist eine globale Variable, die Ihre Aufgaben enthält

function updateProgressBar(taskId) {
  const task = tasks.find((item) => item.id === taskId);
  const progressBar = document.querySelector(
    `.tasks[data-id="${taskId}"].progressbar`
  );

  if (task && progressBar) {
    const subtasksDone = task.subtasks.filter((subtask) => subtask.done).length;
    const subtasksTotal = task.subtasks.length;

    // Aktualisiere die Fortschrittsleiste
    const progressPercentage =
      subtasksTotal > 0 ? (subtasksDone / subtasksTotal) * 100 : 0;
    progressBar.style.width = `${progressPercentage}%`;

    // Aktualisiere die Anzeige für Subtasks
    const subtaskDisplay = document.querySelector(
      `.task[data-id="${taskId}"] .subtask-display`
    );
    if (subtaskDisplay) {
      subtaskDisplay.textContent = `${subtasksDone}/${subtasksTotal} Subtasks`;
    }
  }
}

// Beispiel für das Hinzufügen von Unteraufgaben zu einer Aufgabe
tasks.subtasks = [
  { id: 1, title: "Subtask 1", done: true },
  { id: 2, title: "Subtask 2", done: false },
];

// Beispiel für das Aktualisieren der Fortschrittsleiste und Anzeige für Subtasks
updateProgressBar(0);

function moveTo(field) {
  tasks[currentDraggedElement]["field"] = field;
  updateHTML();
}

function allowDrop(ev) {
  ev.preventDefault();
}

function highlight(id) {
  document.getElementById(id).classList.add("drag-area-highlight");
}

function removeHighlight(id) {
  document.getElementById(id).classList.remove("drag-area-highlight");
}

function createTask() {
  var form = document.getElementById("task-form");

  if (form.checkValidity() === false) {
    alert("Bitte füllen Sie alle erforderlichen Felder aus");
    return;
  }

  
  let titleInput = document.getElementById("task-title-input");
  let descriptionInput = document.getElementById("description-input");
  let dateInput = document.getElementById("date");
  let subtasksInput = document.getElementById("input-subtasks");
  let fieldInput = document.getElementById("task-field");

  // Speichern Sie die Werte in Variablen, bevor Sie sie löschen
  let title = titleInput.value;
  let description = descriptionInput.value;
  let date = dateInput.value;
  let subtasks = subtasksInput.value;
  let field = fieldInput.value;

  // Erstelle eine eindeutige ID für die Aufgabe
  let taskId = tasks.length;

  // Setze die Werte auf leer mit Platzhalter zurück
  titleInput.value = "";
  descriptionInput.value = "";
  dateInput.value = "";
  subtasksInput.value = "";

  let task = {
    id: taskId,
    field: field,
    title: title,
    description: description,
    date: date,
    priority: getPriorityImagePath(currentPriority),
    contacts: "?",
    subtasks: subtasks,
  };

  tasks.push(task);
  console.log(tasks);

  updateHTML();

  let closeTask = document.getElementById("full-task-card");
  closeTask.classList.add("d-none");

  resetAllButtons();
  currentPriority = null;
}
function getPriorityImagePath(priority) {
  if (priority === "red") {
    return "/assets/img/board/Prio-red.png";
  } else if (priority === "yellow") {
    return "/assets/img/board/Prio-yellow.png";
  } else if (priority === "green") {
    return "/assets/img/board/Prio-green.png";
  } else {
    return "/assets/img/board/Prio-red.png";
  }
}
// Funktion für addTask um Category auszuwählen

function showTaskSelect(selectedOption) {
  let taskSelectCategory = document.getElementById("task-select-category");
  let arrowDownImg = document.getElementById("arrow_down");
  let arrowUpImg = document.getElementById("arrow_up");
  let taskCategoryInput = document.getElementById("task-category-input");

  let isVisible = !taskSelectCategory.classList.contains("d-none"); // Überprüfe, ob der Container bereits sichtbar ist
  taskSelectCategory.classList.toggle("d-none"); // Füge oder entferne die 'd-none'-Klasse basierend auf dem aktuellen Zustand

  // Füge oder entferne die 'd-none'-Klasse für die Pfeilbilder
  arrowDownImg.classList.toggle("d-none", !isVisible);
  arrowUpImg.classList.toggle("d-none", isVisible);

  let selectedText = selectedOption ? selectedOption.innerText : ""; // Extrahiere den ausgewählten Text aus dem angeklickten Element
  taskCategoryInput.value = selectedText; // Setze den ausgewählten Text in die Input-Fläche
}

// Funtion damit man einzelne subtasks eingeben und anzeigen kann

function addSubtask() {
  // Input-Feld und Subtask-Div abrufen
  let inputSubtasks = document.getElementById("input-subtasks");
  let ulElement = document.getElementById("unsorted-list");

  // Wert des Input-Felds abrufen
  let subtaskText = inputSubtasks.value.trim();

  // Wenn das Input-Feld nicht leer ist
  if (subtaskText !== "") {
    // Neues LI-Element erstellen und den Subtask-Text einfügen
    let liElement = document.createElement("li");
    liElement.textContent = subtaskText;

    // Container für Bearbeiten und Löschen erstellen
    let actionContainer = document.createElement("div");
    actionContainer.classList.add("subtask-img");

    // Bilder für Bearbeiten und Löschen erstellen
    let editImg = document.createElement("img");
    editImg.src = "/assets/img/board/editforSubtask.png";
    editImg.alt = "Edit";
    editImg.onclick = editSubtask;

    let deleteImg = document.createElement("img");
    deleteImg.src = "/assets/img/board/trashforsubtasks.png";
    deleteImg.alt = "Delete";
    deleteImg.onclick = deleteSubtask;

    // Bilder dem Container hinzufügen
    actionContainer.appendChild(editImg);
    actionContainer.appendChild(deleteImg);

    // LI-Element dem UL-Element hinzufügen
    liElement.appendChild(actionContainer);
    ulElement.appendChild(liElement);

    // Input-Feld leeren
    inputSubtasks.value = "";
  }
}

// Funktion zum Testen, um Subtasks zu löschen
function deleteSubtask() {
  let liElement = this.closest("li"); // Das übergeordnete LI-Element finden
  liElement.parentNode.removeChild(liElement);
}

// Funktion zum Testen, um Subtasks zu bearbeiten
function editSubtask() {
  // Den Text des ausgewählten Subtasks abrufen
  let subtaskTextElement = this.parentNode.parentNode;
  let subtaskText = subtaskTextElement.firstChild.nodeValue;

  // Einen neuen Input für die Bearbeitung erstellen
  let inputElement = document.createElement("input");
  inputElement.type = "text";
  inputElement.value = subtaskText;

  // Einen Button zum Akzeptieren der Bearbeitung erstellen
  let acceptButton = document.createElement("img");
  acceptButton.src = "/assets/img/board/done.png";
  acceptButton.style =
    "cursor: pointer; background-color: white; border-radius: 15px;";
  acceptButton.alt = "Done";
  acceptButton.onclick = function () {
    // Den bearbeiteten Text übernehmen
    subtaskTextElement.firstChild.nodeValue = inputElement.value;

    // Bilder für Bearbeiten und Löschen wieder anzeigen
    let subtaskImgContainer = subtaskTextElement.querySelector(".subtask-img");
    subtaskImgContainer.classList.remove("d-none");

    // Das Eingabefeld und den "Done"-Button entfernen
    subtaskTextElement.removeChild(inputElement);
    subtaskTextElement.removeChild(acceptButton);
  };

  // Bilder für Bearbeiten und Löschen ausblenden
  let subtaskImgContainer = subtaskTextElement.querySelector(".subtask-img");
  subtaskImgContainer.classList.add("d-none");

  // Das Eingabefeld und den "Done"-Button dem Subtask-Element hinzufügen
  subtaskTextElement.appendChild(inputElement);
  subtaskTextElement.appendChild(acceptButton);
}

function addTask(field) {
  let taskcard = document.getElementById("full-task-card");
  taskcard.classList.remove("d-none");
  setTimeout(function () {
    taskcard.classList.add("open");
  }, 0);

  // Setze das gewünschte Feld
  document.getElementById("task-field").value = field;
}

function closeTask() {
  let taskcard = document.getElementById("full-task-card");
  taskcard.classList.remove("open");
  setTimeout(function () {
    taskcard.classList.add("d-none");
  }, 500);
}

// farben für die prio Buttons ändern

let currentColor = null;

function resetAllButtons() {
  // Reset red button
  const redImg = document.getElementById("prio-red");
  const redBtn = document.getElementById("prio-btn-red");
  redImg.src = "/assets/img/board/Prio-red.png";
  redBtn.style.backgroundColor = "white";
  redBtn.style.color = "black";
  redBtn.style.borderColor = "white";

  // Reset yellow button
  const yellowImg = document.getElementById("prio-yellow");
  const yellowBtn = document.getElementById("prio-btn-yellow");
  yellowImg.src = "/assets/img/board/Prio-yellow.png";
  yellowBtn.style.backgroundColor = "white";
  yellowBtn.style.color = "black";
  yellowBtn.style.borderColor = "white";

  // Reset green button
  const greenImg = document.getElementById("prio-green");
  const greenBtn = document.getElementById("prio-btn-green");
  greenImg.src = "/assets/img/board/Prio-green.png";
  greenBtn.style.backgroundColor = "white";
  greenBtn.style.color = "black";
  greenBtn.style.borderColor = "white";
}

function changeBtnColor(color) {
  resetAllButtons();
  if (currentColor !== color) {
    currentColor = color;
    // Speichern Sie die ausgewählte Priorität
    currentPriority = color;
    if (color === "red") {
      colorChangeToRed();
    } else if (color === "yellow") {
      colorChangeToYellow();
    } else if (color === "green") {
      colorChangeToGreen();
    }
  } else {
    currentColor = null;
    // Wenn kein Button ausgewählt ist, setze die currentPriority zurück
    currentPriority = null;
  }
}

function colorChangeToRed() {
  redImg = document.getElementById("prio-red");
  redBtn = document.getElementById("prio-btn-red");

  if (redImg.src.endsWith("/assets/img/board/Prio-red.png")) {
    redImg.src = "/assets/img/board/prio-red-white.png";
    redBtn.style.backgroundColor = "rgb(255,61,0)";
    redBtn.style.color = "white";
    redBtn.style.borderColor = "rgb(255,61,0)";
  } else {
    redImg.src = "/assets/img/board/Prio-red.png";
    redBtn.style.backgroundColor = "white";
    redBtn.style.color = "black";
    redBtn.style.borderColor = "white";
  }
}

function colorChangeToYellow() {
  yellowImg = document.getElementById("prio-yellow");
  yellowBtn = document.getElementById("prio-btn-yellow");

  if (yellowImg.src.endsWith("/assets/img/board/Prio-yellow.png")) {
    yellowImg.src = "/assets/img/board/prio-yellow-white.png";
    yellowBtn.style.backgroundColor = "rgb(255,168,0)";
    yellowBtn.style.color = "white";
    yellowBtn.style.borderColor = "rgb(255,168,0)";
  } else {
    yellowImg.src = "/assets/img/board/Prio-yellow.png";
    yellowBtn.style.backgroundColor = "white";
    yellowBtn.style.color = "black";
    yellowBtn.style.borderColor = "white";
  }
}

function colorChangeToGreen() {
  greenImg = document.getElementById("prio-green");
  greenBtn = document.getElementById("prio-btn-green");

  if (greenImg.src.endsWith("/assets/img/board/Prio-green.png")) {
    greenImg.src = "/assets/img/board/prio-green-white.png";
    greenBtn.style.backgroundColor = "rgb(122,226,40)";
    greenBtn.style.color = "white";
    greenBtn.style.borderColor = "rgb(122,226,40)";
  } else {
    greenImg.src = "/assets/img/board/Prio-green.png";
    greenBtn.style.backgroundColor = "white";
    greenBtn.style.color = "black";
    greenBtn.style.borderColor = "white";
  }
}
