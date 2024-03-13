
async function init() {
    includeHTML();
    updateHTML();
    loadAll();
    tasks = JSON.parse(await getItem("board_key"))
}

function updateHTML() {
    setupClearButton();
    showDateOnInput()
}


/**
 * this function creates the whole task and puts it on the remote storage
 * 
 * @param {string} event 
 */
async function createTask(event) {
    event.preventDefault();

    const { title, description, date, createdSubtasks, categoryInput } = getElements();

    let category = getCategory(categoryInput);
    let subtasks = createSubtasks(createdSubtasks);
    let { checkedSubtasks, taskId, progressPercentage } = calculateTaskStats(subtasks, createdSubtasks);
    let task = createTaskObject(title, description, date, category, subtasks, checkedSubtasks, taskId, progressPercentage);

    tasks.push(task);
    await updateAndReset(task);
    redirectToBoardTask();
}


/**
 * this function gets each data information from html
 */
function getElements() {
    const title = document.getElementById("task-title-input");
    const description = document.getElementById("description-input");
    const date = document.getElementById("date");
    const createdSubtasks = document.getElementById("unsorted-list");
    const categoryInput = document.getElementById("task-category-input");
    return { title, description, date, createdSubtasks, categoryInput };
}


/**
 * this function gets the created subtasks and puts it in their places for the remote storage
 * 
 * @param {string} createdSubtasks - each created subtask
 * @returns 
 */
function createSubtasks(createdSubtasks) {
    const subtaskElements = Array.from(createdSubtasks.children);
    return subtaskElements.map(subtaskElement => ({
        title: subtaskElement.textContent.trim(),
        checked: false,
        id: subtaskElement.id,
    }));
}


/**
 * this function calculates the progress of the subtasks 
 * 
 * @param {string} subtasks - just the subtasks
 * @param {string} createdSubtasks - created subtask
 * @returns 
 */
function calculateTaskStats(subtasks, createdSubtasks) {
    const subtasksLength = createdSubtasks.children.length;
    const checkedSubtasks = subtasks.filter(subtask => subtask.checked).length;
    const taskId = Date.now();
    const progressPercentage = subtasksLength > 0 ? (checkedSubtasks / subtasksLength) * 100 : 0;
    return { checkedSubtasks, taskId, progressPercentage };
}


/**
 * 
 * @param {string} title - the title of the task
 * @param {string} description - description of the task
 * @param {number} date - the date of the task
 * @param {string} category - category of the task
 * @param {string} subtasks - subtask of the task
 * @param {string} checkedSubtasks - checked subtask from the task
 * @param {number} taskId - every tasks individuall id
 * @param {number} progressPercentage - every checked subtasks calculated procentage
 * @returns 
 */
function createTaskObject(title, description, date, category, subtasks, checkedSubtasks, taskId, progressPercentage) {
    return {
        id: taskId,
        field: "todo",
        title: title.value,
        description: description.value,
        date: date.value,
        category: category,
        priority: getPriorityImagePath(currentPriority),
        priorityText: priorityText(currentPriority),
        contacts: contactData,
        subtasks: subtasks,
        createdSubtasks: subtasks.length,
        checkedSubtasks: checkedSubtasks,
        progressbar: progressPercentage,
    };
}


/**
 * this function pushes all the data in the json array of tasks
 * 
 * @param {string} task - created task which gets pushed in tasks
 */
async function updateAndReset(task) {
    await setItem("board_key", tasks);
    updateHTML();
    resetForm();
}


/**
 * a function who resets everything back after a task was created
 */
function resetForm() {
    const { title, description, date, categoryInput, createdSubtasks } = getElements();
    title.value = "";
    description.value = "";
    date.value = "";
    categoryInput.value = "";
    createdSubtasks.innerHTML = "";
    resetAllButtons();
    currentPriority = null;
}


/**
 * 
 *  a function where the subtasks gets created
 */
function addSubtask() {
    const inputSubtasks = document.getElementById("input-subtasks");
    const subtaskUL = document.getElementById("unsorted-list");
    const subtaskText = inputSubtasks.value;
    const subtaskID = `subtask-${Date.now()}`;

    if (subtaskUL.children.length >= 4) {
        alert("Du kannst maximal 4 Subtasks erstellen!");
        inputSubtasks.value = "";
        return;
    }

    const newSubtask = createSubtaskElement(subtaskID, subtaskText);

    subtaskUL.appendChild(newSubtask);

    inputSubtasks.value = "";
    setTimeout(restoreInputImg, 0);
    subtaskEventlistener(subtaskID);
}


/**
 * this function creates the subtasks for tasks
 * 
 * @param {string} subtaskText - the text of the subgtask
 * @param {number} subtaskID  - every subtasks individuall id
 * @returns 
 */
function createSubtaskElement(subtaskID, subtaskText) {
    const newSubtask = document.createElement("div");
    newSubtask.id = subtaskID;
    newSubtask.className = "full-subtasks-area";
    newSubtask.innerHTML = `
      <li class="subtask-headline">${subtaskText}</li>
      <div id="subtasksGreyImgs-${subtaskID}" class="subtask-edit-imgs d-none">
        <img src="/assets/img/board/editforSubtask.png" class="subtask-img" onclick="editSubtask('${subtaskID}')">
        <img src="/assets/img/board/trashforsubtasks.png" class="subtask-img" onclick="deleteSubtask('${subtaskID}')">
      </div>
    `;
    return newSubtask;
}


/**
 * in this function the subtasks gets an eventlistener
 * 
 * @param {number} subtaskID - every subtasks individuall id
 */
function subtaskEventlistener(subtaskID) {
    let currentSubtask = document.getElementById(subtaskID);

    // Überprüfen, ob der Eventlistener bereits hinzugefügt wurde
    if (!currentSubtask.dataset.listenerAdded) {
        currentSubtask.addEventListener("mouseenter", mouseEnter.bind(null, subtaskID));
        currentSubtask.addEventListener("mouseleave", mouseLeave.bind(null, subtaskID));
        currentSubtask.dataset.listenerAdded = true;
    }
}



/**
 * this was may first time learning eventlistener 
 * if you hover over the clear button the colors of the imgs changes from black to blue 
 */
function setupClearButton() {
    const clearButton = document.getElementById("clear-button");
    const blackCross = document.getElementById("black-cross");
    const blueCross = document.getElementById("blue-cross");

    clearButton.addEventListener("mouseenter", function () {
        blackCross.classList.add("d-none");
        blueCross.classList.remove("d-none");
    });

    clearButton.addEventListener("mouseleave", function () {
        blackCross.classList.remove("d-none");
        blueCross.classList.add("d-none");
    });
}


/**
 * after you created a task this function sets everythin back
 */
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


/**
 * after you created a task this function sends you to the board site
 */
function redirectToBoardTask() {
    setTimeout(function () {
        window.location.href = '/board.html';
    }, 150);
}