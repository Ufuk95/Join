const tasks = [];
let currentDraggedElement;
let currentPriority = null;
let editedSubtaskText;

async function updateHTML() {
    try {
        ["todo", "in-progress", "await-feedback", "done"].forEach(async (field) => {
            await updateArea(field);
        });
    } catch (error) {
        console.error('An error occurred while updating HTML:', error);
    }

    updateProgressBar(0);
}


async function updateArea(field) {
    const filteredTasks = tasks.filter((t) => t["field"] === field);
    const areaElement = document.getElementById(field);

    // Check if the areaElement exists before updating its innerHTML
    if (areaElement) {
        areaElement.innerHTML = filteredTasks.map(generateTaskHTML).join("");
    } else {
        console.error(`Element with id ${field} not found.`);
    }
}



function generateTaskHTML(element) {
    return `
    <div data-id="${element.id}" draggable="true" ondragstart="startDragging(${element.id})" class="task" onclick="openTaskCard(${element.id})">
        <div>
            <img src="${element.category}">
        </div>
        <div>
            <b style="word-break: break-word;">${element.title}</b>
        </div>
        <div>
            <p class="description-font">${element.description}</p>
        </div>
        <div class="progress-task">
            <div class="progressbar"></div>
            <div class="subtask-display">0/${element.createdSubtasks} Subtasks</div>
        </div>
        <div>
            <img id="priority" src="${element.priority}" alt="Priority">
        </div> 
    </div>`;
}

function openTaskCard(elementId) {
    let element = tasks.find(task => task.id === elementId);
    let removeNone = document.getElementById('card-container');
    removeNone.classList.remove('d-none-card');

    if (element) {
        const cardContainer = document.getElementById("card-container");
        const subtaskHTML = element.subtasks.map((subtask, subtaskIndex) => `
            <div class="subtask-card">
                <img id="subtask-checkbox" class="subtask-image" src="${subtask.checked ? './assets/img/board/checkedForCard.png' : './assets/img/board/checkForCard.png'}" onclick="toggleSubtask(this, ${element.id}, ${subtaskIndex})">
                <p>${subtask.title}</p>
            </div>`).join("");

        cardContainer.innerHTML = `
            <div class="completeCard">
                <div class="taskcard-head">
                    <img class="card-category-img" src="${element.category}">
                    <img class="task-close-X" src="./assets/img/board/close.png" onclick="closeTaskCard()">
                </div>
                <div class="title-card">
                    <p>${element.title}</p>
                </div>
                <div class="description-card">
                    <p>${element.description}</p>
                </div>
                <div class="date-card">
                    <p>Due Date: ${formatDate(element.date)}</p>
                </div>
                <div class="priority-card">
                    <p>Priority:</p>
                    <p>${element.priorityText}</p>
                    <img id="priority" src="${element.priority}" alt="Priority">
                </div>
                <div class="contact-card">
                    <p>Assigned to:</p>
                </div>
                <div>
                    <p>Subtasks: </p>
                    ${subtaskHTML}
                </div>
                <div class="subtaskcard-bottom-footer">
                    <div class="subtaskcard-footer-delete" onclick="deleteTaskCard(${element.id})">
                        <img id="black-trash" src="./assets/img/board/trashforsubtasks.png">
                        <p>Delete</p>
                    </div>
                    <div class="subtaskcard-footer-edit" onclick="editTaskCard(${element.id})">
                        <img id="black-edit" src="./assets/img/board/editforSubtask.png">
                        <p>Edit</p>
                    </div>
                </div>
            </div>`;
        hoverDeleteInSubtaskcard();
    } else {
        console.error(`Element with ID ${elementId} not found.`);
    }
}

function editTaskCard(taskId, editedSubtaskText) {
    const task = tasks.find((item) => item.id === taskId);
    let removeNone = document.getElementById('edit-container');
    removeNone.classList.remove('d-none-card');
    

    if (task) {
        const editCard = document.getElementById('edit-container');
        const subtaskListHTML = task.subtasks.map(subtask => `
            <li id="subtask-${subtask.taskId}">
                <span class="subtask-title">${subtask.title}</span>
                <div id="subtasksGreyImgs-${subtask.id}" class="subtask-edit-imgs">
                    <img src="./assets/img/board/editforSubtask.png" class="subtask-img subtask-img-edit" onclick="editSubtask('${subtask.id}')">
                    <img src="./assets/img/board/trashforsubtasks.png" class="subtask-img subtask-img-trash" onclick="deleteSubtask('${subtask.id}')">
                </div>
            </li>`).join('');


        editCard.innerHTML = `
            <div class="completeCard">
                <div class="right-end">
                    <img class="task-close-X" src="./assets/img/board/close.png" onclick="closeEditTask()">
                </div>
                <div class="task-title">
                    <span class="font-line">Title</span>
                    <input required type="text" class="task-title-input" id="task-title-input" name="taskTitle" placeholder="Enter a title" value="${task.title}">
                </div>
                <div class="task-title">
                    <span class="font-line">Description</span>
                    <textarea id="description-input" cols="30" rows="10" placeholder="Enter a Description">${task.description}</textarea>
                </div>
                <div class="task-title">
                    <span class="font-line">Due Date</span>
                    <div class="task-date-area">
                        <input required type="date" id="date" name="taskDate" placeholder="dd/mm/yyyy" value="${task.date}">
                    </div>
                </div>
                <div class="task-title">
                    <span class="font-line">Priority</span>
                    <div class="task-button-area">
                        <button type="button" id="prio-btn-red" class="prio-btn ${task.checkedPriority === 'red' ? 'checked' : ''}" onclick="changeBtnColor('red')">Urgent
                            <img id="prio-red" src="./assets/img/board/Prio-red.png" alt="Urgent"></button>
                        <button type="button" id="prio-btn-yellow" class="prio-btn ${task.checkedPriority === 'yellow' ? 'checked' : ''}" onclick="changeBtnColor('yellow')">Medium
                            <img id="prio-yellow" src="./assets/img/board/Prio-yellow.png" alt="Medium"></button>
                        <button type="button" id="prio-btn-green" class="prio-btn ${task.checkedPriority === 'green' ? 'checked' : ''}" onclick="changeBtnColor('green')">Low
                            <img id="prio-green" src="./assets/img/board/Prio-green.png" alt="Low"></button>
                    </div>
                </div>  
                <div class="task-title">
                    <span class="font-line">Assigned to</span>
                    <div class="task-contact-input-area">
                        <input type="text" placeholder="Select contacts to assign">
                        <img class="Assigned-img" src="./assets/img/board/arrow_down.png"
                        alt="arrow down" onclick="showContactsInTasks()">
                    </div>
                </div>
                <div class="task-title">
                    <span class="font-line">Subtasks</span>
                    <div class="task-contact-input-area" onclick="changeInputImg()">
                        <input id="input-subtasks" type="text" placeholder="Add new subtasks">
                        <img id="subtask-plus-img" class="Assigned-img"
                            src="./assets/img/board/addTaskAdd.png" alt="plus">
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <img id="subtask-close-img" class="Assigned-img-subtask px24 d-none"
                                src="./assets/img/board/close.png" onclick="deleteSubtaskInput()">
                            <img id="subtask-vector-img" class="Assigned-img-subtask d-none"
                                src="/.assets/img/board/vector-subtask.png">
                            <img id="subtask-checked-img" class="Assigned-img-subtask px24 d-none"
                                src="./assets/img/board/checked.png" onclick="addSubtask()">
                        </div>
                    </div>
                    <ul class="unsorted-list" id="unsorted-list">${subtaskListHTML}</ul>
                </div>
                <div class="right-end">
                    <button class="edit-card-btn">Ok<img src="./assets/img/board/check.png"></button>
                </div>
            </div>`;

            addSubtask(editedSubtaskText);
    } else {
        console.error(`Task with ID ${taskId} not found.`);
    }
}

// Funtion damit man einzelne subtasks eingeben und anzeigen kann

function addSubtask() {
    let inputSubtasks = document.getElementById("input-subtasks");
    let subtaskUL = document.getElementById("unsorted-list");
    let subtaskText = inputSubtasks.value;
    let subtaskID = `subtask-${Date.now()}`;
    
    // Neues Subtask-Element erstellen
    let newSubtask = document.createElement("div");
    newSubtask.id = subtaskID;
    newSubtask.className = "full-subtasks-area";
    newSubtask.innerHTML = `
        <li>${subtaskText}</li>
        <div id="subtasksGreyImgs-${subtaskID}" class="subtask-edit-imgs d-none">
            <img src="./assets/img/board/editforSubtask.png" class="subtask-img" onclick="editSubtask('${subtaskID}')">
            <img src="./assets/img/board/trashforsubtasks.png" class="subtask-img" onclick="deleteSubtask('${subtaskID}')">
        </div>
    `;

    // Neues Subtask-Element dem Subtask-OL hinzufügen
    subtaskUL.appendChild(newSubtask);

    inputSubtasks.value = "";
    setTimeout(restoreInputImg, 0);

    // Event Listener für das aktuelle Subtask-Element hinzufügen
    addSubtaskListeners(subtaskID);
}

function addSubtaskListeners(subtaskID) {
    // Eventlistener für das aktuelle Subtask-Element hinzufügen
    let currentSubtask = document.getElementById(subtaskID);

    // Überprüfen, ob der Eventlistener bereits hinzugefügt wurde
    if (!currentSubtask.dataset.listenerAdded) {
        currentSubtask.addEventListener("mouseenter", mouseEnter.bind(null, subtaskID));
        currentSubtask.addEventListener("mouseleave", mouseLeave.bind(null, subtaskID));

        // Markieren, dass der Eventlistener hinzugefügt wurde
        currentSubtask.dataset.listenerAdded = true;
    }
}

// Eine Funktion um sein Task über die Task Card zu bearbeiten 
function addSubtaskEventListeners(subtaskID) {
    const subtaskContainer = document.getElementById(`subtasksGreyImgs-${subtaskID}`);
    const editImg = subtaskContainer.querySelector(".subtask-img-edit");
    const trashImg = subtaskContainer.querySelector(".subtask-img-trash");

    editImg.addEventListener("click", () => editSubtask(subtaskID));
    trashImg.addEventListener("click", () => deleteSubtask(subtaskID));
}


function toggleSubtask(subtaskImage, taskId, subtaskIndex) {
    const task = tasks.find((item) => item.id === taskId);

    if (task && task.subtasks[subtaskIndex]) {
        const subtask = task.subtasks[subtaskIndex];

        // Überprüfen, ob das Subtask als checked markiert ist
        if (!subtask.checked) {
            // Wenn nicht geprüft, ändere das Bild und setze das Attribut auf "true"
            subtaskImage.src = "./assets/img/board/checkedForCard.png";
            subtask.checked = true;
        } else {
            // Wenn geprüft, ändere das Bild zurück und setze das Attribut auf "false"
            subtaskImage.src = "./assets/img/board/checkForCard.png";
            subtask.checked = false;
        }

        updateProgressBar(taskId);
    }
}

function deleteSubtaskInput() {
    let inputSubtasks = document.getElementById("input-subtasks");
    inputSubtasks.value = "";
    restoreInputImg();
}

function deleteSubtask(subtaskId) {
    const subtaskElement = document.getElementById(subtaskId);

    if (subtaskElement) {
        subtaskElement.remove();
    } else {
        console.error(`Subtask mit der ID ${subtaskId} wurde nicht gefunden!`);
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
        inputElement.id = "subtask-edit";
        inputElement.type = "text";
        inputElement.value = subtaskTextElement.textContent;

        // Einen Button zum Akzeptieren der Bearbeitung erstellen
        let acceptImg = document.createElement("img");
        acceptImg.id = "subtask-done-img";
        acceptImg.src = "./assets/img/board/done.png";
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


function hoverDeleteInSubtaskcard() {
    let subtaskFooterDelete = document.querySelector(".subtaskcard-footer-delete");
    let subtaskFooterEdit = document.querySelector(".subtaskcard-footer-edit");
    let blackTrash = document.getElementById("black-trash");
    let blackEdit = document.getElementById("black-edit");

    subtaskFooterDelete.addEventListener("mouseenter", function () {
        blackTrash.src = "./assets/img/board/blue-trash.svg";
        blackTrash.style = "background-color: white;"
        subtaskFooterDelete.style.color = "rgb(40,171,226)";
    });

    subtaskFooterDelete.addEventListener("mouseleave", function () {
        blackTrash.src = "./assets/img/board/trashforsubtasks.png";
        subtaskFooterDelete.style.color = "black";
    });

    subtaskFooterEdit.addEventListener("mouseenter", function () {
        blackEdit.src = "./assets/img/board/blue-edit.svg";
        subtaskFooterEdit.style.color = "rgb(40,171,226)";
    });
    subtaskFooterEdit.addEventListener("mouseleave", function () {
        blackEdit.src = "./assets/img/board/editforSubtask.png";
        subtaskFooterEdit.style.color = "black";
    });
}


// Eine Funktion um die gesammte Task zu löschen

function deleteTaskCard(taskId) {
    const taskIndex = tasks.findIndex((task) => task.id === taskId);
    if (taskIndex !== -1) {
        tasks.splice(taskIndex, 1);
        updateHTML();
        closeTaskCard();
    } else {
        console.error(`Task with ID ${taskId} not found.`);
    }
}

function closeTaskCard() {
    let addNone = document.getElementById('card-container');
    addNone.classList.add('d-none-card');
}

function closeEditTask() {
    let addNone = document.getElementById('edit-container');
    addNone.classList.add('d-none-card');
}

function formatDate(dateString) {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', options);
}

function updateProgressBar(taskId) {
    const task = tasks.find((item) => item.id === taskId);
    const progressBar = document.querySelector(`.task[data-id="${taskId}"] .progressbar`);

    if (task && progressBar) {
        const subtasksDone = task.subtasks.filter((subtask) => subtask.checked).length;
        const subtasksTotal = task.subtasks.length;

        // Berechne den prozentualen Fortschritt
        const progressPercentage = subtasksTotal > 0 ? (subtasksDone / subtasksTotal) * 100 : 0;

        // Setze die Breite auf 128px, um die leere Fortschrittsleiste darzustellen
        progressBar.style.width = '128px';

        // Setze die Hintergrundfarbe auf Blau entsprechend dem Fortschritt
        progressBar.style.background = `linear-gradient(90deg, #3498db ${progressPercentage}%, #f4f4f4 ${progressPercentage}%)`;

        // Aktualisiere die Anzeige für Subtasks
        const subtaskDisplay = document.querySelector(
            `.task[data-id="${taskId}"] .subtask-display`
        );
        if (subtaskDisplay) {
            subtaskDisplay.textContent = `${subtasksDone}/${subtasksTotal} Subtasks`;
        }
    }
}

function startDragging(id) {
    currentDraggedElement = id;
}

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

function createTask(event) {
    event.preventDefault();

    let titleInput = document.getElementById("task-title-input");
    let descriptionInput = document.getElementById("description-input");
    let dateInput = document.getElementById("date");
    let createdSubtasks = document.getElementById("unsorted-list");
    let fieldInput = document.getElementById("task-field");
    let categoryInput = document.getElementById("task-category-input");

    let title = titleInput.value;
    let description = descriptionInput.value;
    let date = dateInput.value;
    let field = fieldInput.value;
    let category = categoryInput.value;
    let subtasksLength = createdSubtasks.children.length;

    if (category === "Technical Task") {
        category = "./assets/img/board/technical-task.png";
    } else if (category === "User Story") {
        category = "./assets/img/board/user-story.png";
    }

    let subtaskElements = createdSubtasks.children;
    let subtasks = Array.from(subtaskElements).map((subtaskElement) => {
        return {
            title: subtaskElement.textContent.trim(), 
            checked: false,
        };
    });

    let taskId = tasks.length;

    titleInput.value = "";
    descriptionInput.value = "";
    dateInput.value = "";
    categoryInput.value = "";
    createdSubtasks.innerHTML = "";
    let checkedSubtasks = subtasks.filter(subtask => subtask.checked).length;

    let task = {
        id: taskId,
        field: field,
        title: title,
        description: description,
        date: date,
        category: category,
        priority: getPriorityImagePath(currentPriority),
        priorityText: priorityText(currentPriority),
        contacts: "?",
        subtasks: subtasks,
        checkedSubtasks: checkedSubtasks,
        createdSubtasks: subtasksLength,
    };

    tasks.push(task);
    console.log(tasks);

    updateHTML();

    let closeTask = document.getElementById("full-task-card");
    closeTask.classList.add("d-none");

    resetAllButtons();
    currentPriority = null;
}

function priorityText(priority) {
    let low = document.getElementById('prio-btn-green').innerText;
    let medium = document.getElementById('prio-btn-yellow').innerText;
    let urgent = document.getElementById('prio-btn-red').innerText;

    if (priority === "red") {
        return urgent;
    } else if (priority === "yellow") {
        return medium;
    } else if (priority === "green") {
        return low;
    } else {
        return "-empty-";
    }
}


function getPriorityImagePath(priority) {
    if (priority === "red") {
        return "./assets/img/board/Prio-red.png";
    } else if (priority === "yellow") {
        return "./assets/img/board/Prio-yellow.png";
    } else if (priority === "green") {
        return "./assets/img/board/Prio-green.png";
    } else {
        return "./assets/img/board/Prio-red.png";
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

function deleteSubtask(subtaskId) {
    const subtaskElement = document.getElementById(subtaskId);

    if (subtaskElement) {
        subtaskElement.remove();
    } else {
        console.error(`Subtask mit der ID ${subtaskId} wurde nicht gefunden!`);
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
        inputElement.id = "subtask-edit";
        inputElement.type = "text";
        inputElement.value = subtaskTextElement.textContent;

        // Einen Button zum Akzeptieren der Bearbeitung erstellen
        let acceptImg = document.createElement("img");
        acceptImg.id = "subtask-done-img";
        acceptImg.src = "./assets/img/board/done.png";
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
    redImg.src = "./assets/img/board/Prio-red.png";
    redBtn.style.backgroundColor = "white";
    redBtn.style.color = "black";
    redBtn.style.borderColor = "white";

    // Reset yellow button
    const yellowImg = document.getElementById("prio-yellow");
    const yellowBtn = document.getElementById("prio-btn-yellow");
    yellowImg.src = "./assets/img/board/Prio-yellow.png";
    yellowBtn.style.backgroundColor = "white";
    yellowBtn.style.color = "black";
    yellowBtn.style.borderColor = "white";

    // Reset green button
    const greenImg = document.getElementById("prio-green");
    const greenBtn = document.getElementById("prio-btn-green");
    greenImg.src = "./assets/img/board/Prio-green.png";
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
        redImg.src = "./assets/img/board/prio-red-white.png";
        redBtn.style.backgroundColor = "rgb(255,61,0)";
        redBtn.style.color = "white";
        redBtn.style.borderColor = "rgb(255,61,0)";
    } else {
        redImg.src = "./assets/img/board/Prio-red.png";
        redBtn.style.backgroundColor = "white";
        redBtn.style.color = "black";
        redBtn.style.borderColor = "white";
    }
}

function colorChangeToYellow() {
    yellowImg = document.getElementById("prio-yellow");
    yellowBtn = document.getElementById("prio-btn-yellow");

    if (yellowImg.src.endsWith("/assets/img/board/Prio-yellow.png")) {
        yellowImg.src = "./assets/img/board/prio-yellow-white.png";
        yellowBtn.style.backgroundColor = "rgb(255,168,0)";
        yellowBtn.style.color = "white";
        yellowBtn.style.borderColor = "rgb(255,168,0)";
    } else {
        yellowImg.src = "./assets/img/board/Prio-yellow.png";
        yellowBtn.style.backgroundColor = "white";
        yellowBtn.style.color = "black";
        yellowBtn.style.borderColor = "white";
    }
}

function colorChangeToGreen() {
    greenImg = document.getElementById("prio-green");
    greenBtn = document.getElementById("prio-btn-green");

    if (greenImg.src.endsWith("/assets/img/board/Prio-green.png")) {
        greenImg.src = "./assets/img/board/prio-green-white.png";
        greenBtn.style.backgroundColor = "rgb(122,226,40)";
        greenBtn.style.color = "white";
        greenBtn.style.borderColor = "rgb(122,226,40)";
    } else {
        greenImg.src = "./assets/img/board/Prio-green.png";
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