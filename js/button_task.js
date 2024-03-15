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
        return "Medium" || priority == "";
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
        return "./assets/img/board/Prio-yellow.png";
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
    let taskCardElement = document.querySelector('.task-card');
    taskCardElement.style.transition = 'none';
    setTimeout(function () {
        taskcard.classList.add("open");
        taskCardElement.style.transition = '';
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

document.addEventListener("DOMContentLoaded", function() {
    colorChangeToYellow();
});



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