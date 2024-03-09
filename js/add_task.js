let tasks = [];
let currentDraggedElement;
let currentPriority = null;
let currentColor = null;


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

function getElements() {
    const title = document.getElementById("task-title-input");
    const description = document.getElementById("description-input");
    const date = document.getElementById("date");
    const createdSubtasks = document.getElementById("unsorted-list");
    const categoryInput = document.getElementById("task-category-input");
    return { title, description, date, createdSubtasks, categoryInput };
}

function getCategory(categoryInput) {
    let category = categoryInput.value;
    if (category === "Technical Task") {
        return "/assets/img/board/technical-task.png";
    } else if (category === "User Story") {
        return "/assets/img/board/user-story.png";
    }
    return category;
}

function createSubtasks(createdSubtasks) {
    const subtaskElements = Array.from(createdSubtasks.children);
    return subtaskElements.map(subtaskElement => ({
        title: subtaskElement.textContent.trim(),
        checked: false,
        id: subtaskElement.id,
    }));
}

function calculateTaskStats(subtasks, createdSubtasks) {
    const subtasksLength = createdSubtasks.children.length;
    const checkedSubtasks = subtasks.filter(subtask => subtask.checked).length;
    const taskId = Date.now();
    const progressPercentage = subtasksLength > 0 ? (checkedSubtasks / subtasksLength) * 100 : 0;
    return { checkedSubtasks, taskId, progressPercentage };
}

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

async function updateAndReset(task) {
    await setItem("board_key", tasks);
    updateHTML();
    resetForm();
}

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
}

function mouseLeave(subtaskID) {
    let greyImgs = document.getElementById(`subtasksGreyImgs-${subtaskID}`);
    greyImgs.classList.add("d-none");
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

function createInputElement(value) {
    const inputElement = document.createElement("input");
    inputElement.classList = "subtask-edit";
    inputElement.classList.remove("task-title");
    inputElement.id = "subtask-edit";
    inputElement.type = "text";
    inputElement.value = value;
    return inputElement;
}

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


function addTask(field) {
    let taskcard = document.getElementById("full-task-card");
    taskcard.classList.remove("d-none");
    setTimeout(function () {
        taskcard.classList.add("open");
    }, 0);

    // Setze das gewünschte Feld
    document.getElementById("task-field").value = field;
}

// Diese Funktion ändert per knopfdruck die Farben der Buttons
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


// farben für die prio Buttons ändern

function resetAllButtons() {
    resetRedButton()
    resetYellowButton()
    resetGreenButton()
}

function resetRedButton() {
    const redImg = document.getElementById("prio-red");
    const redBtn = document.getElementById("prio-btn-red");
    redImg.src = "./assets/img/board/prio_red.png";
    redBtn.style.backgroundColor = "white";
    redBtn.style.color = "black";
    redBtn.style.borderColor = "white";
}

function resetYellowButton() {
    const yellowImg = document.getElementById("prio-yellow");
    const yellowBtn = document.getElementById("prio-btn-yellow");
    yellowImg.src = "./assets/img/board/Prio-yellow.png";
    yellowBtn.style.backgroundColor = "white";
    yellowBtn.style.color = "black";
    yellowBtn.style.borderColor = "white";
}

function resetGreenButton() {
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
    }
}

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
        blackCross.classList.add("d-none");
        blueCross.classList.remove("d-none");
    });

    clearButton.addEventListener("mouseleave", function () {
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


function redirectToBoardTask() {
    setTimeout(function () {
        window.location.href = '/board.html';
    }, 300);
}

// Contact Area

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
        let initials = contact[2];
        let colorIndex = calculateColorMap(i);
        let isSelected = contactData.names.includes(contact[0]);
        let selectedClass = isSelected ? "selected" : "";
        let imgSrc = isSelected ? './assets/img/board/checked_for_contact.svg' : './assets/img/board/checkForCard.png';
        chooseContact.innerHTML += renderContactData(selectedClass, contact, imgSrc, initials, colorIndex, i);
    }
}

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



let contactData = {
    icons: [],
    names: [],
};

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

function removeContact(contactName) {
    let index = contactData.names.indexOf(contactName);
    if (index !== -1) {
        contactData.names.splice(index, 1);
        contactData.icons.splice(index, 1);
        updateIconArea();
    }
}

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
