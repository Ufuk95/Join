let tasks = [];
let currentDraggedElement;
let currentPriority = null;
let editedSubtaskText;



function init() {
    includeHTML();
    updateHTML();
    TaskFromStorage();

}

async function TaskFromStorage() {
    tasks = JSON.parse(await getItem("board_key"));
    updateHTML();
}

async function updateHTML() {
    try {
        for (const field of ["todo", "in-progress", "await-feedback", "done"]) {
            updateArea(field);
        }
    } catch (error) {
        console.error('An error occurred while updating HTML:', error);
    }

    updateProgressBar(0);
    showDateOnInput();
    setupCancelButton();
}


function updateArea(field) {
    const areaElement = document.getElementById(field);
    areaElement.innerHTML = "";
    let filteredTasks = tasks.filter((t) => t["field"] === field);

    for (let i = 0; i < filteredTasks.length; i++) {
        let element = filteredTasks[i];
        areaElement.innerHTML += generateTaskHTML(element);
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
            <div class="progressbar" style="width: 128px; background: linear-gradient(90deg, #3498db ${element.progressbar}%, #f4f4f4 ${element.progressbar}%)"></div>
            <div class="subtask-display">${element.checkedSubtasks}/${element.createdSubtasks} Subtasks</div>
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

function editTaskCard(taskId) {
    const task = tasks.find((item) => item.id === taskId);
    let removeNone = document.getElementById('edit-container');
    removeNone.classList.remove('d-none-card');


    if (task) {
        const editCard = document.getElementById('edit-container');
        const subtaskListHTML = task.subtasks.map(subtask => `
            <div id="${subtask.id}" class="full-subtasks-area">
                <li>${subtask.title}</li>
                <div id="subtasksGreyImgs-${subtask.id}" class="subtask-edit-imgs d-none">
                    <img src="./assets/img/board/editforSubtask.png" class="subtask-img" onclick="editSubtask('${subtask.id}')">
                    <img src="./assets/img/board/trashforsubtasks.png" class="subtask-img" onclick="deleteSubtask('${subtask.id}')">
                </div>
            </div>`).join('');

        editCard.innerHTML = `
            <div class="completeCard">
                <div class="right-end">
                    <img class="task-close-X" src="./assets/img/board/close.png" onclick="closeEditTask()">
                </div>
                <div class="task-title">
                    <span class="font-line">Title</span>
                    <input required type="text" class="task-title-input" id="task-title-input" name="taskTitle" autocomplete="off" placeholder="Enter a title" value="${task.title}">
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
                        <button type="button" id="prio-btn-red" class="prio-btn" onclick="changeBtnColor('red')">Urgent
                            <img id="prio-red" src="${task.priority}" alt="Urgent"></button>
                        <button type="button" id="prio-btn-yellow" class="prio-btn" onclick="changeBtnColor('yellow')">Medium
                            <img id="prio-yellow" src="${task.priority}" alt="Medium"></button>
                        <button type="button" id="prio-btn-green" class="prio-btn" onclick="changeBtnColor('green')">Low
                            <img id="prio-green" src="${task.priority}" alt="Low"></button>
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
                        <input id="input-subtasks" autocomplete="off" type="text" placeholder="Add new subtasks">
                        <img id="subtask-plus-img" class="Assigned-img"
                            src="./assets/img/board/addTaskAdd.png" alt="plus">
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <img id="subtask-close-img" class="Assigned-img-subtask px24 d-none"
                                src="./assets/img/board/close.png" onclick="deleteSubtaskInput()">
                            <img id="subtask-vector-img" class="Assigned-img-subtask d-none"
                                src="./assets/img/board/vector-subtask.png">
                            <img id="subtask-checked-img" class="Assigned-img-subtask px24 d-none"
                                src="./assets/img/board/checked.png" onclick="addSubtask()">
                        </div>
                    </div>
                    <ul class="unsorted-list" id="unsorted-list">${subtaskListHTML}</ul>
                <div class="right-end">
                    <button class="edit-card-btn" onclick="saveEditedTask(${taskId})">Ok<img src="./assets/img/board/footerCheckBtn.png"></button>
                </div>
            </div>`; 
            changeBtnColor(task);
            buttonForEditTaskCard(task);
        task.subtasks.forEach(subtask => addSubtaskListeners(`${subtask.id}`));
    } else {
        console.error(`Task with ID ${taskId} not found.`);
    }
}

function buttonForEditTaskCard(tasks) {
    switch (tasks.priority) {
        case './assets/img/board/prio_red.png':
            changeBtnColor('red');
            break;
        case './assets/img/board/Prio-yellow.png':
            changeBtnColor('yellow');
            break;
        case './assets/img/board/Prio-green.png':
            changeBtnColor('green');
            break;
        default:
            resetAllButtons();
            break;
    }
}

function addSubtask() {
    let inputSubtasks = document.getElementById("input-subtasks");
    let subtaskUL = document.getElementById("unsorted-list");
    let subtaskText = inputSubtasks.value;
    let subtaskID = `subtask-${Date.now()}`;

    // Überprüfen, ob bereits vier Subtasks vorhanden sind
    if (subtaskUL.children.length >= 4) {
        alert("Du kannst maximal 4 subtasks erstellen!");
        inputSubtasks.value = "";
        return; // Abbruch der Funktion, wenn bereits 4 Subtasks vorhanden sind
    }

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

    subtaskUL.appendChild(newSubtask);
    addSubtaskListeners(subtaskID);
    inputSubtasks.value = "";
    setTimeout(restoreInputImg, 0);
}


function addSubtaskListeners(subtaskID) {
    let currentSubtask = document.getElementById(subtaskID);

    if (currentSubtask) {
        if (!currentSubtask.dataset.listenerAdded) {
            currentSubtask.addEventListener("mouseenter", mouseEnter.bind(null, subtaskID));
            currentSubtask.addEventListener("mouseleave", mouseLeave.bind(null, subtaskID));

            // Markieren, dass der Eventlistener hinzugefügt wurde
            currentSubtask.dataset.listenerAdded = true;
        }
    } else {
        console.error(`Element with ID ${subtaskID} not found.`);
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


async function toggleSubtask(subtaskImage, taskId, subtaskIndex) {
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

        // Zähle die Anzahl der überprüften Teilaufgaben
        const checkedSubtasks = task.subtasks.filter(subtask => subtask.checked).length;
        // Aktualisiere die Anzahl der überprüften Teilaufgaben im task-Objekt
        task.checkedSubtasks = checkedSubtasks;

        updateProgressBar(taskId);

        // Aktualisierung des Fortschritts im task-Objekt
        const progressPercentage = task.createdSubtasks > 0 ? (checkedSubtasks / task.createdSubtasks) * 100 : 0;
        task.progressbar = progressPercentage;

        await setItem("board_key", tasks);
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
        blackTrash.style = "background-color: white;";
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

async function deleteTaskCard(taskId) {
    for (let i = 0; i < tasks.length; i++) {
        let task = tasks[i];
        if (taskId === task.id) {
            tasks.splice(i, 1);
        }
    }
    await setItem("board_key", tasks);
    closeTaskCard();
    updateHTML();
}



function closeTaskCard() {
    let addNone = document.getElementById('card-container');
    addNone.classList.add('d-none-card');
}

function closeEditTask() {
    let addNone = document.getElementById('edit-container');
    addNone.classList.add('d-none-card');
}

// Speichert die veränderten/editierten elemente in tasks und ladet sie gleichzeitig ins remote storage hoch.
async function saveEditedTask(taskId) {
    try {
        const taskIndex = tasks.findIndex(task => task.id === taskId);
        if (taskIndex !== -1) {
            const editedTask = { ...tasks[taskIndex] }; // Kopie des vorhandenen Tasks

            editedTask.title = document.getElementById('task-title-input').value;
            editedTask.description = document.getElementById('description-input').value;
            editedTask.date = document.getElementById('date').value;
            editedTask.priority = getPriorityImagePath(currentPriority); // Verwenden Sie den aktuellen Prioritätswert

            // Extrahiere die Subtasks aus dem DOM
            const createdSubtasks = document.getElementById('unsorted-list');
            const subtaskElements = createdSubtasks.children;
            const subtasks = Array.from(subtaskElements).map(subtaskElement => {
                return {
                    title: subtaskElement.textContent.trim(),
                    checked: false, // Sie können die checked-Eigenschaft hier aktualisieren, falls benötigt
                    id: subtaskElement.id,
                };
            });

            editedTask.subtasks = subtasks; // Aktualisieren Sie die Subtasks im bearbeiteten Task
            editedTask.createdSubtasks = subtasks.length; // Aktualisieren Sie die Anzahl der erstellten Subtasks
            tasks[taskIndex] = editedTask;
            updateHTML();
            await setItem("board_key", tasks); 
            location.reload();
        } else {
            console.error(`Task with ID ${taskId} not found.`);
        }
    } catch (error) {
        console.error(error);
    }
}
//deleteTaskCard()

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
    // await setItem("board_key", tasks);
}

function startDragging(id) {
    currentDraggedElement = id;
}

async function moveTo(field) {
    const selectedTask = tasks.find(task => task.id === currentDraggedElement);

    if (selectedTask) {
        selectedTask.field = field;
        await setItem("board_key", tasks);
        updateHTML();
    } else {
        console.error("Selected task not found!");
    }
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

async function createTask(event) {
    event.preventDefault();

    let title = document.getElementById("task-title-input");
    let description = document.getElementById("description-input");
    let date = document.getElementById("date");
    let createdSubtasks = document.getElementById("unsorted-list");
    let field = document.getElementById("task-field");
    let categoryInput = document.getElementById("task-category-input");

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
            id: subtaskElement.id,
        };
    });

    let checkedSubtasks = subtasks.filter(subtask => subtask.checked).length;
    let taskId = Date.now();
    let progressPercentage = subtasksLength > 0 ? (checkedSubtasks / subtasksLength) * 100 : 0;

    let task = {
        id: taskId,
        field: field.value,
        title: title.value,
        description: description.value,
        date: date.value,
        category: category,
        priority: getPriorityImagePath(currentPriority),
        priorityText: priorityText(currentPriority),
        contacts: "?",
        subtasks: subtasks,
        checkedSubtasks: checkedSubtasks,
        createdSubtasks: subtasksLength,
        progressbar: progressPercentage
    };

    tasks.push(task);
    await setItem("board_key", tasks);
    updateHTML()

    title.value = "";
    description.value = "";
    date.value = "";
    categoryInput.value = "";
    createdSubtasks.innerHTML = "";

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
        return "-empty-" || priority == "";
    }
}


function getPriorityImagePath(priority) {
    if (priority === "red") {
        return "./assets/img/board/prio_red.png";
    } else if (priority === "yellow") {
        return "./assets/img/board/Prio-yellow.png";
    } else if (priority === "green") {
        return "./assets/img/board/Prio-green.png";
    } else {
        return "./assets/img/board/prio_red.png";
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
    redImg.src = "./assets/img/board/prio_red.png";
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
        currentPriority = null;
    }
}

function colorChangeToRed() {
    redImg = document.getElementById("prio-red");
    redBtn = document.getElementById("prio-btn-red");

    if (redImg.src.endsWith("/assets/img/board/prio_red.png")) {
        redImg.src = "./assets/img/board/prio-red-white.png";
        redBtn.style.backgroundColor = "rgb(255,61,0)";
        redBtn.style.color = "white";
        redBtn.style.borderColor = "rgb(255,61,0)";
    } else {
        redImg.src = "./assets/img/board/prio_red.png";
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

function showDateOnInput() {
    document.getElementById("date").addEventListener('focus', function (event) {
        event.target.showPicker();
    });
}
function setupCancelButton() {
    const cancelButton = document.getElementById("cancel-button");
    const blackCross = document.getElementById("black-cross");
    const blueCross = document.getElementById("blue-cross");

    cancelButton.addEventListener("mouseenter", function () {
        blackCross.classList.add("d-none");
        blueCross.classList.remove("d-none");
    });

    cancelButton.addEventListener("mouseleave", function () {
        blackCross.classList.remove("d-none");
        blueCross.classList.add("d-none");
    });
}

function toggleContactAreaVisibility() {
    let contactArea = document.querySelector(".contact-area");
    let arrowDownContact = document.getElementById("arrow_down_contact");
    let arrowUpContact = document.getElementById("arrow_up_contact");

    let isVisible = !contactArea.classList.contains("d-none");
    contactArea.classList.toggle("d-none");

    arrowDownContact.classList.toggle("d-none", !isVisible);
    arrowUpContact.classList.toggle("d-none", isVisible);
}

async function showContactsInTasks() {
    toggleContactAreaVisibility();
    
    let chooseContact = document.getElementById('contact-area');
    chooseContact.innerHTML = "";
    let contactInformation = JSON.parse(await getItem("userData"));

    for (let i = 0; i < contactInformation.length; i++) {
        const contact = contactInformation[i];
        chooseContact.innerHTML += `
        <div class="completeContactArea" onclick="toggleBackgroundColor(this)">
            <div class="contact-info">
                <div class="single-letter">${contact[2]}</div>
                <div class="contact-name">${contact[0]}</div>
            </div>
            <img id="emptyBox" class="empty-check-box" src="./assets/img/board/checkForCard.png">
        </div>`;
    }
}

function toggleBackgroundColor(element) {
    element.classList.toggle("selected");

    let imgBox = element.querySelector(".empty-check-box");
    if (element.classList.contains("selected")) {
        imgBox.src = './assets/img/board/checked_for_contact.svg';
    } else {
        imgBox.src = './assets/img/board/checkForCard.png';
    }
}