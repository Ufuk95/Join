
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
 */
function showTaskSelect(selectedOption) {
    let categorySelect = document.getElementById("task-select-category");
    let arrowDownImg = document.getElementById("arrow_down");
    let arrowUpImg = document.getElementById("arrow_up");
    let taskCategoryInput = document.getElementById("task-category-input");
    let isVisible = !categorySelect.classList.contains("d-none");

    let selectedText = selectedOption ? selectedOption.innerText : "";
    taskCategoryInput.value = selectedText;

    if (!isVisible && event.target === taskCategoryInput) {
        showCategorySelect(categorySelect, arrowDownImg, arrowUpImg);
    } else {
        toggleCategorySelect(categorySelect, arrowDownImg, arrowUpImg, isVisible);
    }
    
    closeCategorySelectOnEmptyClick(categorySelect, arrowDownImg, arrowUpImg, taskCategoryInput);
}


/**
 * Displays the category selection field and updates the arrow icons accordingly.
 * 
 * @param {HTMLElement} categorySelect - The HTML element of the category selection field.
 * @param {HTMLElement} arrowDownImg - The HTML element for the downward arrow icon.
 * @param {HTMLElement} arrowUpImg - The HTML element for the upward arrow icon.
 */
function showCategorySelect(categorySelect, arrowDownImg, arrowUpImg) {
    categorySelect.classList.remove("d-none");
    arrowDownImg.classList.add("d-none");
    arrowUpImg.classList.remove("d-none");
}

/**
 * Toggles the visibility of the category selection field and updates the arrow icons accordingly.
 * 
 * @param {HTMLElement} categorySelect - The HTML element of the category selection field.
 * @param {HTMLElement} arrowDownImg - The HTML element for the downward arrow icon.
 * @param {HTMLElement} arrowUpImg - The HTML element for the upward arrow icon.
 * @param {boolean} isVisible - Indicates whether the category selection field is visible.
 */
function toggleCategorySelect(categorySelect, arrowDownImg, arrowUpImg, isVisible) {
    categorySelect.classList.toggle("d-none");
    arrowDownImg.classList.toggle("d-none", !isVisible);
    arrowUpImg.classList.toggle("d-none", isVisible);
}

/**
 * Closes the category selection field when clicked outside of the field and updates the arrow icons accordingly.
 * 
 * @param {HTMLElement} categorySelect - The HTML element of the category selection field.
 * @param {HTMLElement} arrowDownImg - The HTML element for the downward arrow icon.
 * @param {HTMLElement} arrowUpImg - The HTML element for the upward arrow icon.
 * @param {HTMLElement} taskCategoryInput - The HTML element for the category input.
 */
function closeCategorySelectOnEmptyClick(categorySelect, arrowDownImg, arrowUpImg, taskCategoryInput) {
    document.addEventListener('click', function(event) {
        const isClickInsideCategorySelect = categorySelect.contains(event.target);
        const isClickOnArrow = event.target.classList.contains("Assigned-img");
        if (!isClickInsideCategorySelect && !isClickOnArrow && event.target !== taskCategoryInput) {
            categorySelect.classList.add("d-none");
            arrowDownImg.classList.remove("d-none");
            arrowUpImg.classList.add("d-none");
        }
    });
}