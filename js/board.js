let tasks = [];
let currentDraggedElement;
let currentPriority = null;
let editedSubtaskText;
let currentColor = null;
let contactData = {
    icons: [],
    names: [],
};

function init() {
    includeHTML();
    updateHTML();
    loadAll()
    TaskFromStorage();
}
/**
 * this function is for getting the data information from the remote storage
 */
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

/**
 * 
 * this function is for the place for the task  
 * @param {string} field - the place where the task supposed to be
 */
function updateArea(field) {
    const areaElement = document.getElementById(field);
    areaElement.innerHTML = "";
    let filteredTasks = tasks.filter((t) => t["field"] === field);

    for (let i = 0; i < filteredTasks.length; i++) {
        let element = filteredTasks[i];
        areaElement.innerHTML += generateTaskHTML(element);
    }
}

/**
 * 
 * this render function show the small task 
 * 
 * @param {string} element - element === tasks
 * @returns 
 */
function generateTaskHTML(element) {
    let iconsHTML = element.contacts.icons.join('');
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
        <div class="bottom-task">
            <div class="d-flex">${iconsHTML}</div> 
            <img id="priority" src="${element.priority}" alt="Priority" class="prio-position">
        </div> 
    </div>`;
}


/**
 * if you click on the task the taskcard opens
 * 
 * @param {number} elementId - individual id for every task
 * @returns 
 */
function openTaskCard(elementId) {
    const element = tasks.find(task => task.id === elementId);
    if (!element) {
        console.error(`Element with ID ${elementId} not found.`);
        return;
    }

    const removeNone = document.getElementById('card-container');
    removeNone.classList.remove('d-none-card');

    const combinedHTMLString = generateCombinedHTML(element);
    const cardContainer = document.getElementById("card-container");
    const subtaskHTML = element.subtasks.map((subtask, subtaskIndex) => renderCheckIMG(subtask, subtaskIndex, element)).join("");

    cardContainer.innerHTML = renderTaskCard(element, combinedHTMLString, subtaskHTML);
    hoverDeleteInSubtaskcard();
}
/**
 * 
 * this function renders the optic of the contact data information
 * @param {string} element - element === tasks
 * @returns 
 */
function generateCombinedHTML(element) {
    const combinedHTML = element.contacts.icons.map((icon, index) => `
        <div class="icon-name-pair">
            <div>${icon}</div>
            <div>${element.contacts.names[index]}</div>
        </div>
    `).join("");
    return combinedHTML;
}

/**
 * 
 * this function renders the subtask check img 
 * task card area
 * @param {string} subtask - each created subtask
 * @param {number} subtaskIndex - each subtasks individual ID
 * @param {string} element - element === tasks
 * @returns 
 */
function renderCheckIMG(subtask, subtaskIndex, element) {
    return `
    <div class="subtask-card">
        <img id="subtask-checkbox" class="subtask-image" src="${subtask.checked ? './assets/img/board/checkedForCard.png' : './assets/img/board/checkForCard.png'}" onclick="toggleSubtask(this, ${element.id}, ${subtaskIndex})">
        <p>${subtask.title}</p>
    </div>`
}
/**
 * 
 * @param {string} element - element === tasks
 * @param {string} combinedHTMLString - contact information
 * @param {string} subtaskHTML - subtask information
 * @returns 
 */
function renderTaskCard(element, combinedHTMLString, subtaskHTML) {
    return `
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
            <div class="d-flex">
                <div>${combinedHTMLString}</div>
            </div>
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
    </div>`
}
/**
 * 
 * @param {number} taskId - every tasks individuall id 
 */
function editTaskCard(taskId) {
    const task = tasks.find((item) => item.id === taskId);
    let removeNone = document.getElementById('edit-container');
    removeNone.classList.remove('d-none-card');

    if (task) {
        let iconContact = task.contacts.icons.join("");
        const editCard = document.getElementById('edit-container');
        const subtaskListHTML = task.subtasks.map(subtask => renderEditSubtasks(subtask)).join('');

        editCard.innerHTML = renderEditCard(task, taskId, iconContact, subtaskListHTML);
        changeBtnColor(task);
        buttonForEditTaskCard(task);
        task.subtasks.forEach(subtask => addSubtaskListeners(`${subtask.id}`));
    } else {
        console.error(`Task with ID ${taskId} not found.`);
    }
}

/**
 * 
 * @param {string} subtask - subtask information 
 * @returns 
 */
function renderEditSubtasks(subtask) {
    return `
    <div id="${subtask.id}" class="full-subtasks-area">
        <li>${subtask.title}</li>
        <div id="subtasksGreyImgs-${subtask.id}" class="subtask-edit-imgs d-none">
            <img src="./assets/img/board/editforSubtask.png" class="subtask-img" onclick="editSubtask('${subtask.id}')">
            <img src="./assets/img/board/trashforsubtasks.png" class="subtask-img" onclick="deleteSubtask('${subtask.id}')">
        </div>
    </div>`
}

/**
 * this function renders the edit area for the tasks
 * 
 * @param {string} task - task
 * @param {number} taskId - every tasks individuall id 
 * @param {string} iconContact - contacts icon design
 * @param {string} subtaskListHTML - subtasks
 * @returns 
 */
function renderEditCard(task, taskId, iconContact, subtaskListHTML) {
    return `
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
            <div class="task-contact-input-area" onclick="showContactsInTasks()">
                <input type="none" placeholder="Select contacts to assign">
                <img class="Assigned-img" src="./assets/img/board/arrow_down.png" id="arrow_down_contact" alt="arrow down">
                <img class="Assigned-img d-none" src="./assets/img/board/arrow_up.png" id="arrow_up_contact" alt="#">
            </div>
            <div class="contact-area d-none" id="contact-area"></div>
            <div class="contact-icon-area " id="icon-area">${iconContact}</div>
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
    </div>`
}

/**
 * 
 * this function changes the button function in the edit area
 * 
 * @param {string} tasks 
 */
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
/**
 * 
 *  Hier werden die Subtasks erstellt
 */
function addSubtask() {
    const inputSubtasks = document.getElementById("input-subtasks");
    const subtaskUL = document.getElementById("unsorted-list");
    const subtaskText = inputSubtasks.value;

    if (subtaskUL.children.length >= 4) {
        alert("Du kannst maximal 4 subtasks erstellen!");
        inputSubtasks.value = "";
        return;
    }

    const subtaskID = `subtask-${Date.now()}`;
    const newSubtask = createSubtaskElement(subtaskText, subtaskID);

    subtaskUL.appendChild(newSubtask);
    addSubtaskListeners(subtaskID);
    inputSubtasks.value = "";
    setTimeout(restoreInputImg, 0);
}

/**
 * this function creates the subtasks for tasks
 * 
 * @param {string} subtaskText 
 * @param {string} subtaskID 
 * @returns 
 */
function createSubtaskElement(subtaskText, subtaskID) {
    const newSubtask = document.createElement("div");
    newSubtask.id = subtaskID;
    newSubtask.className = "full-subtasks-area";
    newSubtask.innerHTML = `
        <li>${subtaskText}</li>
        <div id="subtasksGreyImgs-${subtaskID}" class="subtask-edit-imgs d-none">
            <img src="./assets/img/board/editforSubtask.png" class="subtask-img" onclick="editSubtask('${subtaskID}')">
            <img src="./assets/img/board/trashforsubtasks.png" class="subtask-img" onclick="deleteSubtask('${subtaskID}')">
        </div>
    `;
    return newSubtask;
}


/**
 * This function puts the hover effects from each subtask in place
 * 
 * @param {number} subtaskID - This is the ID of every task in tasks
 */
function addSubtaskListeners(subtaskID) {
    let currentSubtask = document.getElementById(subtaskID);

    if (currentSubtask) {
        if (!currentSubtask.dataset.listenerAdded) {
            currentSubtask.addEventListener("mouseenter", mouseEnter.bind(null, subtaskID));
            currentSubtask.addEventListener("mouseleave", mouseLeave.bind(null, subtaskID));
            currentSubtask.dataset.listenerAdded = true;
        }
    } else {
        console.error(`Element with ID ${subtaskID} not found.`);
    }
}

/**
 * this function let you editing your subtask 
 * 
 * @param {number} subtaskID - This is the ID of every task in tasks
 */
function addSubtaskEventListeners(subtaskID) {
    const subtaskContainer = document.getElementById(`subtasksGreyImgs-${subtaskID}`);
    const editImg = subtaskContainer.querySelector(".subtask-img-edit");
    const trashImg = subtaskContainer.querySelector(".subtask-img-trash");

    editImg.addEventListener("click", () => editSubtask(subtaskID));
    trashImg.addEventListener("click", () => deleteSubtask(subtaskID));
}

/**
 * this function is for checking the subtasks and saves in the remote storage 
 * 
 * @param {string} subtaskImage - the imgs for checked 
 * @param {number} taskId - This is the ID of every task in tasks
 * @param {*} subtaskIndex 
 */
async function toggleSubtask(subtaskImage, taskId, subtaskIndex) {
    const task = tasks.find((item) => item.id === taskId);
    if (task && task.subtasks[subtaskIndex]) {
        const subtask = task.subtasks[subtaskIndex];
        if (!subtask.checked) {
            subtaskImage.src = "./assets/img/board/checkedForCard.png";
            subtask.checked = true;
        } else {
            subtaskImage.src = "./assets/img/board/checkForCard.png";
            subtask.checked = false;
        }

        const checkedSubtasks = task.subtasks.filter(subtask => subtask.checked).length;
        task.checkedSubtasks = checkedSubtasks;
        updateProgressBar(taskId);
        const progressPercentage = task.createdSubtasks > 0 ? (checkedSubtasks / task.createdSubtasks) * 100 : 0;
        task.progressbar = progressPercentage;
        await setItem("board_key", tasks);
    }
}


/**
 *  this function delete the input in subtask
 * 
 */
function deleteSubtaskInput() {
    let inputSubtasks = document.getElementById("input-subtasks");
    inputSubtasks.value = "";
    restoreInputImg();
}

/**
 *  this function deletes the subtask
 * 
 */
function deleteSubtask(subtaskId) {
    const subtaskElement = document.getElementById(subtaskId);

    if (subtaskElement) {
        subtaskElement.remove();
    } else {
        console.error(`Subtask mit der ID ${subtaskId} wurde nicht gefunden!`);
    }
}


/**
 * this function is for editing the subtask 
 * 
 * @param {number} subtaskID - This is the ID of every task in tasks
 */
function editSubtask(subtaskID) {
    const subtaskContainer = document.getElementById(subtaskID);
    if (!subtaskContainer) return console.error("Das Subtask-Element wurde nicht gefunden!");

    const subtaskTextElement = subtaskContainer.querySelector("li");
    if (!subtaskTextElement) return console.error("Das Textelement des Subtasks wurde nicht gefunden!");

    const editImgsContainer = subtaskContainer.querySelector(".subtask-edit-imgs");
    if (editImgsContainer) editImgsContainer.classList.add("d-none");

    const inputElement = createInputElement(subtaskTextElement.textContent);
    const acceptImg = createAcceptButton(subtaskTextElement, inputElement, subtaskContainer);

    subtaskContainer.appendChild(inputElement);
    subtaskContainer.appendChild(acceptImg);
}

/**
 * 
 * this function creates the input element for the subtasks where you can edit the subtask again
 */
function createInputElement(value) {
    const inputElement = document.createElement("input");
    inputElement.id = "subtask-edit";
    inputElement.type = "text";
    inputElement.value = value;
    return inputElement;
}

/**
 * this function creates the accept button if you changed a subtask 
 * 
 * @param {string} subtaskTextElement - input value
 * @param {string} subtaskContainer - subtask container
 * @returns 
 */
function createAcceptButton(subtaskTextElement, inputElement, subtaskContainer) {
    const acceptImg = document.createElement("img");
    acceptImg.id = "subtask-done-img";
    acceptImg.src = "./assets/img/board/done.png";
    acceptImg.classList.add("accept-button");
    acceptImg.onclick = function () {
        subtaskTextElement.textContent = inputElement.value;
        subtaskContainer.removeChild(inputElement);
        subtaskContainer.removeChild(acceptImg);
    };
    return acceptImg;
}


/**
 * if you hover over a subtask there is a trash img 
 * with that you can delete a subtask
 */
function hoverDeleteInSubtaskcard() {
    let subtaskFooterDelete = document.querySelector(".subtaskcard-footer-delete");
    let subtaskFooterEdit = document.querySelector(".subtaskcard-footer-edit");
    let blackTrash = document.getElementById("black-trash");
    let blackEdit = document.getElementById("black-edit");

    subtaskTrashImgEventlistener(subtaskFooterDelete, blackTrash)
    subtaskEditImgEventlistener(subtaskFooterEdit, blackEdit)
}

/**
 * a eventlistener for the subtask
 * 
 * @param {*} subtaskFooterDelete - subtaskFooterDelete function
 * @param {string} blackTrash - the id of the trash img
 */
function subtaskTrashImgEventlistener(subtaskFooterDelete, blackTrash) {
    subtaskFooterDelete.addEventListener("mouseenter", function () {
        blackTrash.src = "./assets/img/board/blue-trash.svg";
        blackTrash.style = "background-color: white;";
        subtaskFooterDelete.style.color = "rgb(40,171,226)";
    });

    subtaskFooterDelete.addEventListener("mouseleave", function () {
        blackTrash.src = "./assets/img/board/trashforsubtasks.png";
        subtaskFooterDelete.style.color = "black";
    });
}

/**
 * this funcion interacts with the eventlistener to show the imgs
 * 
 * @param {string} subtaskFooterEdit - querySelector of the class subtaskcard-footer-edit
 * @param {*} blackEdit - id of the edit img
 */
function subtaskEditImgEventlistener(subtaskFooterEdit, blackEdit) {
    subtaskFooterEdit.addEventListener("mouseenter", function () {
        blackEdit.src = "./assets/img/board/blue-edit.svg";
        subtaskFooterEdit.style.color = "rgb(40,171,226)";
    });
    subtaskFooterEdit.addEventListener("mouseleave", function () {
        blackEdit.src = "./assets/img/board/editforSubtask.png";
        subtaskFooterEdit.style.color = "black";
    });
}

/**
 * this function is for deleting the whole task on board
 * 
 * @param {number} taskId - This is the ID of every task in tasks
 */
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


/**
 * this function closes the task in add task area on the board site
 * 
 */
function closeTaskCard() {
    let addNone = document.getElementById('card-container');
    addNone.classList.add('d-none-card');
}

/**
 * this function closes the editing task 
 * 
 */
function closeEditTask() {
    let addNone = document.getElementById('edit-container');
    addNone.classList.add('d-none-card');
}

/**
 * this function saves all the changes in editing area and saves it on remote storage 
 * 
 * @param {number} taskId - This is the ID of every task in tasks
 */
async function saveEditedTask(taskId) {
    try {
        const taskIndex = tasks.findIndex(task => task.id === taskId);
        if (taskIndex === -1) {
            console.error(`Task with ID ${taskId} not found.`);
            return;
        }

        const editedTask = createEditedTask(taskIndex);

        tasks[taskIndex] = editedTask;
        updateAndReload();
    } catch (error) {
        console.error(error);
    }
}

/**
 * this function saves the changes in edit task to the normal task area
 * 
 * @param {number} taskIndex 
 * @returns 
 */
function createEditedTask(taskIndex) {
    const editedTask = { ...tasks[taskIndex] };

    editedTask.title = document.getElementById('task-title-input').value;
    editedTask.description = document.getElementById('description-input').value;
    editedTask.date = document.getElementById('date').value;
    editedTask.priority = getPriorityImagePath(currentPriority);
    editedTask.contacts = contactData;

    const subtasks = Array.from(document.getElementById('unsorted-list').children).map(subtaskElement => ({
        title: subtaskElement.textContent.trim(),
        checked: false,
        id: subtaskElement.id,
    }));

    editedTask.subtasks = subtasks;
    editedTask.createdSubtasks = subtasks.length;
    return editedTask;
}

/**
 * this function updates and saves the task in the remote storage
 */
async function updateAndReload() {
    updateHTML();
    await setItem("board_key", tasks);
    location.reload();
}

/**
 * this function creates the numeric design of the date
 * 
 * @param {number} dateString - dd/mm/yyyy
 * @returns 
 */
function formatDate(dateString) {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', options);
}

/**
 * this function is for the subtasks if they are checked then the progressbar is filling the bar
 * 
 * @param {number} taskId  - This is the ID of every task in tasks
 */
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
/**
 * this function gives an empty parameter an id
 * 
 * @param {number} id 
 */
function startDragging(id) {
    currentDraggedElement = id;
}

/**
 * 
 * @param {string} field - field area in tasks
 */
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

/**
 * this function let you drop the task to another area
 * 
 * @param {string} ev - ev === event
 */
function allowDrop(ev) {
    ev.preventDefault();
}

function highlight(id) {
    document.getElementById(id).classList.add("drag-area-highlight");
}

function removeHighlight(id) {
    document.getElementById(id).classList.remove("drag-area-highlight");
}


/**
 * this function creates the whole task and puts it on the remote storage
 * 
 * @param {string} event 
 */
async function createTask(event) {
    event.preventDefault();

    const { title, description, date, createdSubtasks, field, categoryInput } = extractElements();
    let { category, subtasks, checkedSubtasks, taskId, progressPercentage } = prepareData(categoryInput, createdSubtasks);

    const task = createTaskObject(title, description, date, field, category, subtasks, checkedSubtasks, taskId, progressPercentage);

    await updateTaskAndHTML(task);
    resetFieldsAndButtons(title, description, date, categoryInput, createdSubtasks);
}

/**
 * this function extracts each data information from html
 */
function extractElements() {
    const title = document.getElementById("task-title-input");
    const description = document.getElementById("description-input");
    const date = document.getElementById("date");
    const createdSubtasks = document.getElementById("unsorted-list");
    const field = document.getElementById("task-field");
    const categoryInput = document.getElementById("task-category-input");
    return { title, description, date, createdSubtasks, field, categoryInput };
}

/**
 * this function is just for collecting data fpr the subtasks
 * 
 * @param {string} categoryInput - User Story / Technical Task
 * @param {string} createdSubtasks - each created subtask
 * @returns 
 */
function prepareData(categoryInput, createdSubtasks) {
    let category = getCategory(categoryInput);
    const subtasks = getSubtasks(createdSubtasks);
    const checkedSubtasks = countCheckedSubtasks(subtasks);
    const taskId = Date.now();
    const progressPercentage = calculateProgress(subtasks, checkedSubtasks);
    return { category, subtasks, checkedSubtasks, taskId, progressPercentage };
}

/**
 * this function changes the imgs of the category
 * 
 * @param {string} categoryInput - User Story / Technical Task
 * @returns 
 */
function getCategory(categoryInput) {
    let category = categoryInput.value;
    if (category === "Technical Task") {
        category = "./assets/img/board/technical-task.png";
    } else if (category === "User Story") {
        category = "./assets/img/board/user-story.png";
    }
    return category;
}

/**
 * this function gets the created subtasks and puts it in their places for the remote storage
 * 
 * @param {string} createdSubtasks - each created subtask
 * @returns 
 */
function getSubtasks(createdSubtasks) {
    const subtaskElements = Array.from(createdSubtasks.children);
    return subtaskElements.map(subtaskElement => ({
        title: subtaskElement.textContent.trim(),
        checked: false,
        id: subtaskElement.id
    }));
}

/**
 * this small function filters the length of the checked subtasks
 * 
 * @param {string} subtasks - just the subtasks
 * @returns 
 */
function countCheckedSubtasks(subtasks) {
    return subtasks.filter(subtask => subtask.checked).length;
}

/**
 * this function calculates the progress of the subtasks 
 * 
 * @param {string} subtasks - just the subtasks
 * @param {string} checkedSubtasks - parameter for the checked subtask
 * @returns 
 */
function calculateProgress(subtasks, checkedSubtasks) {
    const subtasksLength = subtasks.length;
    return subtasksLength > 0 ? (checkedSubtasks / subtasksLength) * 100 : 0;
}

/**
 * this function collects all the data for the json array of tasks
 * 
 * @param {string} title - the title of the task
 * @param {string} description - description of the task
 * @param {number} date - the date of the task
 * @param {string} field - the field of the task
 * @param {string} category - category of the task
 * @param {string} subtasks - subtask of the task
 * @param {string} checkedSubtasks - checked subtask from the task
 * @param {number} taskId - every tasks individuall id
 * @param {number} progressPercentage - every checked subtasks calculated procentage
 * @returns 
 */
function createTaskObject(title, description, date, field, category, subtasks, checkedSubtasks, taskId, progressPercentage) {
    return {
        id: taskId,
        field: field.value,
        title: title.value,
        description: description.value,
        date: date.value,
        category: category,
        priority: getPriorityImagePath(currentPriority),
        priorityText: priorityText(currentPriority),
        contacts: {
            names: contactData.names.slice(),
            icons: contactData.icons.slice()
        },
        subtasks: subtasks,
        checkedSubtasks: checkedSubtasks,
        createdSubtasks: subtasks.length,
        progressbar: progressPercentage
    };
}

/**
 * this function pushes all the data in the json array of tasks
 * 
 * @param {string} task - 
 */
async function updateTaskAndHTML(task) {
    tasks.push(task);
    await setItem("board_key", tasks);
    updateHTML();
}

/**
 * this function sets all the choosen data back to normal after the task was created
 * 
 * @param {string} title - the title of the task
 * @param {string} description - description of the task
 * @param {number} date - the date of the task
 * @param {string} categoryInput - category imgs for the tasks
 * @param {string} createdSubtasks - all the created subtasks
 */
function resetFieldsAndButtons(title, description, date, categoryInput, createdSubtasks) {
    title.value = "";
    description.value = "";
    date.value = "";
    categoryInput.value = "";
    createdSubtasks.innerHTML = "";

    const closeTask = document.getElementById("full-task-card");
    closeTask.classList.add("d-none");

    resetAllButtons();
    currentPriority = null;
}


/**
 * if you open a task you will see the button imgs and their designation
 * 
 * @param {string} priority - prioritybuttons
 * @returns 
 */
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

/**
 * this function sets the button imgs 
 * urgent is red 
 * medium is yellow
 * low is green
 * 
 * @param {string} priority - prioritybuttons
 * @returns 
 */
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

/**
 * this function is for choosing the the task option  Technical Task or User Story
 * 
 * @param {string} selectedOption 
 */
function showTaskSelect(selectedOption) {
    let taskSelectCategory = document.getElementById("task-select-category");
    let arrowDownImg = document.getElementById("arrow_down");
    let arrowUpImg = document.getElementById("arrow_up");
    let taskCategoryInput = document.getElementById("task-category-input");

    let isVisible = !taskSelectCategory.classList.contains("d-none");
    taskSelectCategory.classList.toggle("d-none");

    arrowDownImg.classList.toggle("d-none", !isVisible);
    arrowUpImg.classList.toggle("d-none", isVisible);

    let selectedText = selectedOption ? selectedOption.innerText : "";
    taskCategoryInput.value = selectedText;
}

/**
 * this function is for the eventlistener for the subtasks 
 * 
 * @param {number} subtaskID - every tasks individuall id
 */
function mouseEnter(subtaskID) {
    let greyImgs = document.getElementById(`subtasksGreyImgs-${subtaskID}`);
    greyImgs.classList.remove("d-none");
}

/**
 * this function is for the eventlistener for the subtasks 
 * 
 * @param {number} subtaskID - every tasks individuall id
 */
function mouseLeave(subtaskID) {
    let greyImgs = document.getElementById(`subtasksGreyImgs-${subtaskID}`);
    greyImgs.classList.add("d-none");
}

/**
 * The function ensures that the created tasks are used where they belong
 * 
 * @param {string} field - fields for the kanban  todo/in-progress etc.
 */
function addTask(field) {
    let taskcard = document.getElementById("full-task-card");
    taskcard.classList.remove("d-none");
    setTimeout(function () {
        taskcard.classList.add("open");
    }, 0);
    document.getElementById("task-field").value = field;
}

/**
 * a function to close the task
 */
function closeTask() {
    let taskcard = document.getElementById("full-task-card");
    taskcard.classList.remove("open");
    setTimeout(function () {
        taskcard.classList.add("d-none");
    }, 500);
}

/**
 * 
 * this function sets all the buttons back after their use
 */
function resetAllButtons() {
    resetRedButton()
    resetYellowButton()
    resetGreenButton()
}

/**
 * resets the red button
 */
function resetRedButton() {
    const redImg = document.getElementById("prio-red");
    const redBtn = document.getElementById("prio-btn-red");
    redImg.src = "./assets/img/board/prio_red.png";
    redBtn.style.backgroundColor = "white";
    redBtn.style.color = "black";
    redBtn.style.borderColor = "white";
}

/**
 * resetes the yellow button
 */
function resetYellowButton() {
    const yellowImg = document.getElementById("prio-yellow");
    const yellowBtn = document.getElementById("prio-btn-yellow");
    yellowImg.src = "./assets/img/board/Prio-yellow.png";
    yellowBtn.style.backgroundColor = "white";
    yellowBtn.style.color = "black";
    yellowBtn.style.borderColor = "white";
}

/**
 * resets the green button
 */
function resetGreenButton() {
    const greenImg = document.getElementById("prio-green");
    const greenBtn = document.getElementById("prio-btn-green");
    greenImg.src = "./assets/img/board/Prio-green.png";
    greenBtn.style.backgroundColor = "white";
    greenBtn.style.color = "black";
    greenBtn.style.borderColor = "white";
}

/**
 * this function is for the buttons 
 * they let you changing the colors of the buttons and set them back when you click another button
 * 
 * @param {string} color - the color of the tasks 
 */
function changeBtnColor(color) {
    resetAllButtons();
    if (currentColor !== color) {
        currentColor = color;
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

/**
 * 
 * if you use the urgent button it changes to red 
 * if not it stays white
 */
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

/**
 * if you use the medium button it changes to yellow 
 * if not it stays white
 * 
 */
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

/**
 * 
 * if you use the low button it changes to green 
 * if not it stays white
 */
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

/**
 * if you click on the input area on subtasks the imgs are changing
 */
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

/**
 * this function restores the imgs after creating a task
 */
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

/**
 * this function puts the choosen date on the input area
 */
function showDateOnInput() {
    document.getElementById("date").addEventListener('focus', function (event) {
        event.target.showPicker();
    });
}

/**
 * this is the function for the cancel button at the bottom of the create task area
 */
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


/**
 * 
 * this function is for showing the contacts in creating subtask area with a toggle function
 */
function toggleContactAreaVisibility() {
    let contactArea = document.querySelector(".contact-area");
    let arrowDownContact = document.getElementById("arrow_down_contact");
    let arrowUpContact = document.getElementById("arrow_up_contact");

    let isVisible = !contactArea.classList.contains("d-none");
    contactArea.classList.toggle("d-none");

    arrowDownContact.classList.toggle("d-none", !isVisible);
    arrowUpContact.classList.toggle("d-none", isVisible);
}


/**
 * 
 * this function is for the rendering the contacts 
 * 
 */
async function showContactsInTasks() {
    toggleContactAreaVisibility();

    let chooseContact = document.getElementById('contact-area');
    chooseContact.innerHTML = "";
    let contactInformation = JSON.parse(await getItem("userData"));

    for (let i = 0; i < contactInformation.length; i++) {
        const contact = contactInformation[i];
        let initials = contact[2];
        let colorIndex = calculateColorMap(i);
        let isSelected = contactData.names.includes(contact[0]);
        let selectedClass = isSelected ? "selected" : "";
        let imgSrc = isSelected ? './assets/img/board/checked_for_contact.svg' : './assets/img/board/checkForCard.png';
        chooseContact.innerHTML += renderContactData(selectedClass, contact, imgSrc, initials, colorIndex, i);
    }
}

/**
 * this function renders the contact data with an icon
 * 
 * @param {string} selectedClass - selected class
 * @param {string} contact - contact data
 * @param {string} imgSrc - img source
 * @param {string} initials - initials of the contact names
 * @param {string} colorIndex - hex code of the colors for the icons
 * @returns 
 */
function renderContactData(selectedClass, contact, imgSrc, initials, colorIndex, i) {
    return `
    <div class="completeContactArea ${selectedClass}" onclick="addContact(this)">
        <div class="contact-info">
            <div class="single-letter">${contactFrameHTML(initials, colorIndex, i)}</div>
            <div class="contact-name">${contact[0]}</div>
        </div>
        <img id="emptyBox" class="empty-check-box" src="${imgSrc}">
    </div>`
}
/**
 * 
 * this is only for rendering the icon svg 
 * 
 * @param {string} initials - the initials of the contacts 
 * @param {string} colorNumber - the color number from the icons
 * @param {string} i - each contact data
 * @returns 
 */
function contactFrameHTML(initials, colorNumber, i) {
    return `
    <div class="contact-frame contact-frame${i}">
        <div class="name-circle-wrapper name-in-circle${i}">
            <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle  cx="21" cy="21" r="20" fill=${colorCarousell[colorNumber]} stroke="white" stroke-width="2" />
            </svg>
            <span class="initials initials${i}">${initials}</span>
        </div>
    </div>`;
}

/**
 * Calculates an index based on the amount of colors in colorCarousell.
 * @param {number} index - Index number of a contact. 
 * 
 */
function calculateColorMap(index) {
    let colorMapLen = Object.keys(colorCarousell).length;
    return index % colorMapLen;
}

/**
 * this function is for you be able to choose the contacts
 * 
 * @param {string} element - tasks
 */
function addContact(element) {
    let isSelected = element.classList.contains("selected");
    let iconArea = document.getElementById('icon-area');
    let imgBox = element.querySelector(".empty-check-box");
    const contactName = element.querySelector('.contact-name').textContent;

    if (!isSelected) {
        element.classList.add("selected");
        imgBox.src = './assets/img/board/checked_for_contact.svg';
        iconOfContact(contactName, iconArea);
    } else {
        element.classList.remove("selected");
        imgBox.src = './assets/img/board/checkForCard.png';
        removeContact(contactName);
    }
}

/**
 * this function is for removing the contact
 * 
 * @param {string} contactName - the name of the contact
 */
function removeContact(contactName) {
    let index = contactData.names.indexOf(contactName);
    if (index !== -1) {
        contactData.names.splice(index, 1);
        contactData.icons.splice(index, 1);
        updateIconArea();
    }
}

/**
 * this function updates the icons if the amount is under 0
 */
function updateIconArea() {
    let iconArea = document.getElementById('icon-area');
    iconArea.innerHTML = '';

    for (let i = 0; i < contactData.icons.length; i++) {
        iconArea.innerHTML += contactData.icons[i];
    }
    if (contactData.icons.length === 0) {
        iconArea.classList.add("d-none");
    } else {
        iconArea.classList.remove("d-none");
    }
}

/**
 * this function gets all the contact information and renders it
 * 
 * @param {string} contactName - the names of the contacts
 * @param {string} iconArea - the place where the icons supposed to be
 */
async function iconOfContact(contactName, iconArea) {
    iconArea.classList.remove('d-none');

    let contactInformation = JSON.parse(await getItem("userData"));
    for (let i = 0; i < contactInformation.length; i++) {
        let contact = contactInformation[i];
        if (contact[0] === contactName) {
            let initials = contact[2];
            let colorIndex = calculateColorMap(i);
            let contactIcon = contactFrameHTML(initials, colorIndex, i);

            contactData.icons.push(contactIcon);
            contactData.names.push(contactName);
            updateIconArea();
            break;
        }
    }
}

/**
 * 
 * this function is for the search input on the board site to find tasks with their title or description
 */
function searchTasks() {
    let searchText = document.querySelector('.board-search input').value.toLowerCase();
    let tasksContainer = document.querySelector('.drag-drop-headline');

    tasksContainer.querySelectorAll('.task').forEach(task => {
        let title = task.querySelector('b').textContent.toLowerCase();
        let description = task.querySelector('.description-font').textContent.toLowerCase();

        if (title.includes(searchText) || description.includes(searchText)) {
            task.style.display = 'flex';
        } else {
            task.style.display = 'none';
        }
    });
}