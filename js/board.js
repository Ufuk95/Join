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


/**
 * this is the main function to update the board site
 */
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

    if (element.subtasks.length === 0) {
        return taskWithoutProgressbar(element, iconsHTML);

    } else {
        return taskWithProgressbar(element, iconsHTML);

    }
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
 *  a function where the subtasks gets created
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
 * @param {string} subtaskText - the text of the subgtask
 * @param {string} subtaskID  - every subtasks individuall id
 * @returns 
 */
function createSubtaskElement(subtaskText, subtaskID) {
    const newSubtask = document.createElement("div");
    newSubtask.id = subtaskID;
    newSubtask.className = "full-subtasks-area";
    newSubtask.innerHTML = renderSubtasktData(subtaskText,subtaskID);
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
 * this function saves the changes from edit task to the normal task area
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
