let tasks = [];
let currentDraggedElement;
let currentPriority = null;
let currentColor = null;
let contactData = {
    icons: [],
    names: [],
};


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
 * this function changes the imgs of the category
 * 
 * @param {string} categoryInput - User Story / Technical Task
 * @returns 
 */
function getCategory(categoryInput) {
    let category = categoryInput.value;
    if (category === "Technical Task") {
        return "/assets/img/board/technical-task.png";
    } else if (category === "User Story") {
        return "/assets/img/board/user-story.png";
    }
    return category;
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
    tasks.push(task);
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
        return "-empty-";
    }
}


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

    let isVisible = !taskSelectCategory.classList.contains("d-none"); // Überprüfe, ob der Container bereits sichtbar ist
    taskSelectCategory.classList.toggle("d-none"); // Füge oder entferne die 'd-none'-Klasse basierend auf dem aktuellen Zustand

    // Füge oder entferne die 'd-none'-Klasse für die Pfeilbilder
    arrowDownImg.classList.toggle("d-none", !isVisible);
    arrowUpImg.classList.toggle("d-none", isVisible);

    let selectedText = selectedOption ? selectedOption.innerText : ""; // Extrahiere den ausgewählten Text aus dem angeklickten Element
    taskCategoryInput.value = selectedText; // Setze den ausgewählten Text in die Input-Fläche
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
 * @param {number} subtaskId - subtasks individuall id
 */
function deleteSubtask(subtaskID) {
    let subtaskElement = document.getElementById(subtaskID);
    if (subtaskElement) {
        subtaskElement.remove();
    } else {
        console.error("Das Subtask-Element wurde nicht gefunden!");
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
    inputElement.classList = "subtask-edit";
    inputElement.classList.remove("task-title");
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
    acceptImg.src = "/assets/img/board/done.png";
    acceptImg.classList.add("accept-button");
    acceptImg.onclick = function () {
        subtaskTextElement.textContent = inputElement.value;
        subtaskContainer.removeChild(inputElement);
        subtaskContainer.removeChild(acceptImg);
    };
    return acceptImg;
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

    // Setze das gewünschte Feld
    document.getElementById("task-field").value = field;
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
        return "/assets/img/board/prio_red.png";
    } else if (priority === "yellow") {
        return "/assets/img/board/Prio-yellow.png";
    } else if (priority === "green") {
        return "/assets/img/board/Prio-green.png";
    } else {
        return "/assets/img/board/prio_red.png";
    }
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
 * resets the yellow button
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
        redImg.src = "/assets/img/board/prio-red-white.png";
        redBtn.style.backgroundColor = "rgb(255,61,0)";
        redBtn.style.color = "white";
        redBtn.style.borderColor = "rgb(255,61,0)";
    } else {
        redImg.src = "/assets/img/board/prio_red.png";
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


/**
 * 
 * if you use the low button it changes to green 
 * if not it stays white
 */
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
 * this function puts the choosen date on the input area
 */
function showDateOnInput() {
    document.getElementById("date").addEventListener('focus', function (event) {
        event.target.showPicker();
    });
}


/**
 * after you created a task this function sends you to the board site
 */
function redirectToBoardTask() {
    setTimeout(function () {
        window.location.href = '/board.html';
    }, 300);
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
 * @param {Number} index Index number of a contact. 
 * @return {Number} 
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
