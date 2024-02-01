const tasks = [];
let currentDraggedElement;
let currentPriority = null;
let currentColor = null;

function updateHTML() {
    setupClearButton();
    showDateOnInput()
}

function createTask(event) {
    event.preventDefault();

    let title = document.getElementById("task-title-input");
    let description = document.getElementById("description-input");
    let date = document.getElementById("date");
    let createdSubtasks = document.getElementById("unsorted-list");
    // let fieldInput = document.getElementById("task-field");    muss noch gemacht werden damit es von der add task seite zur board seite in todo erscheint!!
    let category = document.getElementById("task-category-input");
    // let field = fieldInput.value;
    let subtasksLength = createdSubtasks.children.length;

    if (category === "Technical Task") {
        category = "/assets/img/board/technical-task.png";
    } else if (category === "User Story") {
        category = "/assets/img/board/user-story.png";
    }

    let subtaskElements = createdSubtasks.children;
    let subtasks = Array.from(subtaskElements).map((subtaskElement) => {
        return {
            title: subtaskElement.textContent.trim(),
            id: subtaskElement.id,
        };
    });

    let taskId = tasks.length;

    let task = {
        id: taskId,
        // field: field,
        title: title.value,
        description: description.value,
        date: date.value,
        category: category.value,
        priority: getPriorityImagePath(currentPriority),
        contacts: "?",
        subtasks: subtasks,
        createdSubtasks: subtasksLength,
    };

    tasks.push(task);
    console.log(tasks);

    title.value = "";
    description.value = "";
    date.value = "";
    category.value = "";
    createdSubtasks.innerHTML = "";

    updateHTML()
    resetAllButtons();
    currentPriority = null;
}

// Diese Funktion ändert per knopfdruck die Farben der Buttons
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
    let inputSubtasks = document.getElementById("input-subtasks");
    let subtaskUL = document.getElementById("unsorted-list");
    let subtaskText = inputSubtasks.value;
    let subtaskID = `subtask-${Date.now()}`;
    let newSubtask = document.createElement("div");
    newSubtask.id = subtaskID;
    newSubtask.className = "full-subtasks-area";

    newSubtask.innerHTML = `
      <li class="subtask-headline">${subtaskText}</li>
      <div id="subtasksGreyImgs-${subtaskID}" class="subtask-edit-imgs d-none">
        <img src="/assets/img/board/editforSubtask.png" class="subtask-img" onclick="editSubtask('${subtaskID}')">
        <img src="/assets/img/board/trashforsubtasks.png" class="subtask-img" onclick="deleteSubtask('${subtaskID}')">
      </div>
    `;

    // Neues Subtask-Element dem Subtask-OL hinzufügen
    subtaskUL.appendChild(newSubtask);

    inputSubtasks.value = "";
    setTimeout(restoreInputImg, 0);
    subtaskEventlistener(subtaskID);
}


function subtaskEventlistener(subtaskID) {
    let currentSubtask = document.getElementById(subtaskID);

    // Überprüfen, ob der Eventlistener bereits hinzugefügt wurde
    if (!currentSubtask.dataset.listenerAdded) {
        currentSubtask.addEventListener("mouseenter", mouseEnter.bind(null, subtaskID));
        currentSubtask.addEventListener("mouseleave", mouseLeave.bind(null, subtaskID));
        currentSubtask.dataset.listenerAdded = true;
    }
}


function mouseEnter(subtaskID) {
    let greyImgs = document.getElementById(`subtasksGreyImgs-${subtaskID}`);
    greyImgs.classList.remove("d-none");
    console.log("Maus betreten!");
}

function mouseLeave(subtaskID) {
    let greyImgs = document.getElementById(`subtasksGreyImgs-${subtaskID}`);
    greyImgs.classList.add("d-none");
    console.log("Maus verlassen!");
}




function deleteSubtaskInput() {
    let inputSubtasks = document.getElementById("input-subtasks");
    inputSubtasks.value = "";
    restoreInputImg();
}

function deleteSubtask(subtaskID) {
    let subtaskElement = document.getElementById(subtaskID);
    if (subtaskElement) {
        subtaskElement.remove();
    } else {
        console.error("Das Subtask-Element wurde nicht gefunden!");
    }
}

function editSubtask(subtaskID) {
    let subtaskContainer = document.getElementById(subtaskID);

    if (subtaskContainer) {
        let subtaskTextElement = subtaskContainer.querySelector("li");

        // Bilder für Bearbeiten und Löschen ausblenden
        let editImgsContainer = subtaskContainer.querySelector(".subtask-edit-imgs");
        editImgsContainer.classList.add("d-none");


        // Einen neuen Input für die Bearbeitung erstellen
        let inputElement = document.createElement("input");
        inputElement.classList = "subtask-edit";
        inputElement.classList.remove("task-title");
        inputElement.id = "subtask-edit";
        inputElement.type = "text";
        inputElement.value = subtaskTextElement.textContent;

        // Einen Button zum Akzeptieren der Bearbeitung erstellen
        let acceptImg = document.createElement("img");
        acceptImg.id = "subtask-done-img";
        acceptImg.src = "/assets/img/board/done.png";
        acceptImg.classList.add("accept-button");
        acceptImg.onclick = function () {
            // Den bearbeiteten Text übernehmen
            subtaskTextElement.textContent = inputElement.value;

            // Das Eingabefeld und den "Done"-Button entfernen
            subtaskContainer.removeChild(inputElement);
            subtaskContainer.removeChild(acceptImg);
        };

        // Das Eingabefeld, das "Done"-Button und das Bestätigen-Bild dem Subtask-Element hinzufügen
        subtaskContainer.appendChild(inputElement);
        subtaskContainer.appendChild(acceptImg);
    } else {
        console.error("Das Subtask-Element wurde nicht gefunden!");
    }
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


// farben für die prio Buttons ändern

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

function changeInputImg() {
    let plusIcon = document.getElementById("subtask-plus-img");
    plusIcon.classList.add("d-none");
    let closeIcon = document.getElementById("subtask-close-img");
    closeIcon.classList.remove("d-none");
    let vectorIcon = document.getElementById("subtask-vector-img");
    vectorIcon.classList.remove("d-none");
    let checkedIcon = document.getElementById("subtask-checked-img");
    checkedIcon.classList.remove("d-none");

}

function restoreInputImg() {
    let plusIcon = document.getElementById("subtask-plus-img");
    let closeIcon = document.getElementById("subtask-close-img");
    let vectorIcon = document.getElementById("subtask-vector-img");
    let checkedIcon = document.getElementById("subtask-checked-img");

    plusIcon.classList.remove("d-none");
    closeIcon.classList.add("d-none");
    vectorIcon.classList.add("d-none");
    checkedIcon.classList.add("d-none");
}


function setupClearButton() {
    const clearButton = document.getElementById("clear-button");
    const blackCross = document.getElementById("black-cross");
    const blueCross = document.getElementById("blue-cross");

    clearButton.addEventListener("mouseenter", function () {
        // Schwarzes Kreuz ausblenden, blaues Kreuz anzeigen
        blackCross.classList.add("d-none");
        blueCross.classList.remove("d-none");
    });


    clearButton.addEventListener("mouseleave", function () {
        // Blaues Kreuz ausblenden, schwarzes Kreuz anzeigen
        blackCross.classList.remove("d-none");
        blueCross.classList.add("d-none");
    });
}


function clearTask() {
    document.getElementById("task-title-input").value = "";
    document.getElementById("description-input").value = "";
    document.getElementById("date").value = "";
    document.getElementById("task-category-input").value = "";
    document.getElementById("input-subtasks").value = "";

    let subtaskUL = document.getElementById("unsorted-list");
    subtaskUL.innerHTML = "";

    resetAllButtons();
    updateHTML();
}


function showDateOnInput() {
    document.getElementById("date").addEventListener('focus', function (event) {
        event.target.showPicker();
    });
}


// function redirectToBoardTask(){
//     window.location.href = '/board.html';
// }