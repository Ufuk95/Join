let tasks = [];
let currentDraggedElement;
let currentPriority = null;
let editedSubtaskText;
let currentColor = null;
let contactData = {
    icons: [],
    names: [],
};

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
 * this function puts the choosen date on the input area
 */
function showDateOnInput() {
    document.getElementById("date").addEventListener('focus', function (event) {
        event.target.showPicker();
    });
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
 * 
 * this function is for showing the contacts in creating subtask area with a toggle function
 */
function toggleContactAreaVisibility() {
    let contactArea = document.querySelector(".contact-area");
    let arrowDownContact = document.getElementById("arrow_down_contact");
    let arrowUpContact = document.getElementById("arrow_up_contact");

    let isVisible = !contactArea.classList.contains("d-none");
    const inputField = document.querySelector(".task-contact-input-area input");

    showContactWithInputClick(isVisible, contactArea, inputField, arrowDownContact, arrowUpContact);
    closeContactWithEmptyClick(arrowDownContact, arrowUpContact, inputField, contactArea)
}


/**
 * this function show you the contact area after you clicked on the input field 
 * 
 * @param {string} isVisible - if the contact area is visible
 * @param {string} contactArea - contactarea
 * @param {inputField} inputField - input field of contact
 * @param {imgBox} arrowDownContact - img of arrow down
 * @param {imgBox} arrowUpContact - img of arrow up
 */
function showContactWithInputClick(isVisible, contactArea, inputField, arrowDownContact, arrowUpContact){
    if (!isVisible && event.target === inputField) {
        contactArea.classList.remove("d-none");
        arrowDownContact.classList.add("d-none");
        arrowUpContact.classList.remove("d-none");
    } else {
        contactArea.classList.toggle("d-none");

        arrowDownContact.classList.toggle("d-none", !isVisible);
        arrowUpContact.classList.toggle("d-none", isVisible);
    }
}


/**
 * this function closes the contact area after you clicked on a empty space
 * 
 * @param {imgBox} arrowDownContact - img of arrow down
 * @param {imgBox} arrowUpContact - img of arrow up
 * @param {string} contactArea - contactarea
 * @param {inputField} inputField - input field of contact
 */
function closeContactWithEmptyClick(arrowDownContact, arrowUpContact, inputField, contactArea){
    document.addEventListener('click', function(event) {
        const isClickInsideContactArea = contactArea.contains(event.target);
        const isClickOnArrow = event.target.classList.contains("Assigned-img");
        if (!isClickInsideContactArea && !isClickOnArrow && event.target !== inputField) {
            contactArea.classList.add("d-none");
            arrowDownContact.classList.remove("d-none");
            arrowUpContact.classList.add("d-none");
        }
    });
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

    if (isVisible) {
        taskSelectCategory.classList.add("d-none");
        arrowDownImg.classList.remove("d-none");
        arrowUpImg.classList.add("d-none");
    } else {
        taskSelectCategory.classList.remove("d-none");
        arrowDownImg.classList.add("d-none");
        arrowUpImg.classList.remove("d-none");
    }

    let selectedText = selectedOption ? selectedOption.innerText : "";
    taskCategoryInput.value = selectedText;

    document.addEventListener('click', function(event) {
        if (!taskSelectCategory.contains(event.target) && event.target !== taskCategoryInput) {
            taskSelectCategory.classList.add("d-none");
            arrowDownImg.classList.remove("d-none");
            arrowUpImg.classList.add("d-none");
        }
    });
}


