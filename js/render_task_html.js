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


function taskWithProgressbar(element, iconsHTML){
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
        <div id="progressbar-task" class="progress-task">
            <div class="progressbar" style="width: 128px; background: linear-gradient(90deg, #3498db ${element.progressbar}%, #f4f4f4 ${element.progressbar}%)"></div>
            <div class="subtask-display">${element.checkedSubtasks}/${element.createdSubtasks} Subtasks</div>
        </div>
        <div class="bottom-task">
            <div class="d-flex">${iconsHTML}</div> 
            <img id="priority" src="${element.priority}" alt="Priority" class="prio-position">
        </div> 
    </div>`;
}


function taskWithoutProgressbar(element, iconsHTML){
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
                <div class="bottom-task">
                    <div class="d-flex">${iconsHTML}</div> 
                    <img id="priority" src="${element.priority}" alt="Priority" class="prio-position">
                </div> 
            </div>`;
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
 * this function renders the task card when you click on a task
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
        <div class="subtask-card-container">
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
 * @param {string} subtaskText - the subtask
 * @param {number} subtaskID - subtasks individuall id
 * @returns 
 */
function renderSubtasktData(subtaskText,subtaskID){
    return `
    <li>${subtaskText}</li>
    <div id="subtasksGreyImgs-${subtaskID}" class="subtask-edit-imgs d-none">
        <img src="./assets/img/board/editforSubtask.png" class="subtask-img" onclick="editSubtask('${subtaskID}')">
        <img src="./assets/img/board/trashforsubtasks.png" class="subtask-img" onclick="deleteSubtask('${subtaskID}')">
    </div>
`
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
