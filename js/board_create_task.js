/**
 * this function updates and saves the task in the remote storage
 */
async function updateAndReload() {
    await setItem("board_key", tasks);
    closeEditTask();
    closeTaskCard();
    updateHTML();
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
        const progressPercentage = subtasksTotal > 0 ? (subtasksDone / subtasksTotal) * 100 : 0;

        progressBar.style.width = '128px';
        progressBar.style.background = `linear-gradient(90deg, #3498db ${progressPercentage}%, #f4f4f4 ${progressPercentage}%)`;
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


/**
 * if you take a task and hover over another drop area the drop area changes the color
 * 
 * @param {number} id - the id of the drop area
 */
function highlight(id) {
    document.getElementById(id).classList.add("drag-area-highlight");
}


/**
 * after the drop the color changes back to his main color
 * 
 * @param {number} id - the id of the drop area
 */
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
 * @param {string} task - created task which gets pushed in tasks
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
    resetContacts();
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
 * a function which resets the contacts
 */
function resetContacts() {
    const emptyIconBlock = document.getElementById('icon-area');
    emptyIconBlock.innerHTML = "";

    let chooseContact = document.getElementById('contact-area');
    let contacts = chooseContact.querySelectorAll('.selected');
    for (let i = 0; i < contacts.length; i++) {
        const contact = contacts[i];
        contact.classList.remove('selected');
        let img = contact.querySelector('img');
        img.src = './assets/img/board/checkForCard.png';
    }
    contactData = {
        icons: [],
        names: [],
    };
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


/**
 * this function searches for every wort in title and description by just tipping in the input field
 */
function searchTaskWithoutClick() {
    document.querySelector('.board-search input').addEventListener('input', searchTasks);
}
searchTaskWithoutClick();