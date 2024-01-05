let board = [{
    'id': 0,
    'title': 'Putzen',
    'description': '',
    'category': 'todo',
    'date': '',
    'priority': '',
    'who': '',
    'subtasks': '',
}, {
    'id': 1,
    'title': 'Kochwelt Page & Recipe Recommender',
    'description': 'Build start page with recipe recommendation',
    'category': 'in-progress',
    'date': '',
    'priority': '',
    'who': '',
    'subtasks': '',
}, {
    'id': 2,
    'title': 'Einkaufen',
    'description': '',
    'category': 'await-feedback',
    'date': '',
    'priority': '',
    'who': '',
    'subtasks': '',
}, {
    'id': 3,
    'title': 'Einkaufen',
    'description': '',
    'category': 'done',
    'date': '',
    'priority': '',
    'who': '',
    'subtasks': '',
}];

let currentDraggedElement;



function updateHTML() {
    let todo = board.filter(t => t['category'] == 'todo');

    document.getElementById('todo').innerHTML = '';

    for (let index = 0; index < todo.length; index++) {
        const element = todo[index];
        document.getElementById('todo').innerHTML += generateTaskHTML(element);
    }

    let in_progress = board.filter(t => t['category'] == 'in-progress');

    document.getElementById('in-progress').innerHTML = '';

    for (let index = 0; index < in_progress.length; index++) {
        const element = in_progress[index];
        document.getElementById('in-progress').innerHTML += generateTaskHTML(element);
    }

    let await_feedback = board.filter(t => t['category'] == 'await-feedback');

    document.getElementById('await-feedback').innerHTML = '';

    for (let index = 0; index < await_feedback.length; index++) {
        const element = await_feedback[index];
        document.getElementById('await-feedback').innerHTML += generateTaskHTML(element);
    }

    let done = board.filter(t => t['category'] == 'done');

    document.getElementById('done').innerHTML = '';

    for (let index = 0; index < done.length; index++) {
        const element = done[index];
        document.getElementById('done').innerHTML += generateTaskHTML(element);
    }
}

function startDragging(id) {
    currentDraggedElement = id;
}




// Annahme: board ist eine globale Variable, die Ihre Aufgaben enthält

function updateProgressBar(taskId) {
    const task = board.find(item => item.id === taskId);
    const progressBar = document.querySelector(`.task[data-id="${taskId}"] .progressbar`);
    
    if (task && progressBar) {
        const subtasksDone = task.subtasks.filter(subtask => subtask.done).length;
        const subtasksTotal = task.subtasks.length;
        
        // Aktualisiere die Fortschrittsleiste
        const progressPercentage = subtasksTotal > 0 ? (subtasksDone / subtasksTotal) * 100 : 0;
        progressBar.style.width = `${progressPercentage}%`;
        
        // Aktualisiere die Anzeige für Subtasks
        const subtaskDisplay = document.querySelector(`.task[data-id="${taskId}"] .subtask-display`);
        if (subtaskDisplay) {
            subtaskDisplay.textContent = `${subtasksDone}/${subtasksTotal} Subtasks`;
        }
    }
}

function generateTaskHTML(element) {
    return `
    <div data-id="${element['id']}" draggable="true" ondragstart="startDragging(${element['id']})" class="task">
        <div>
            <b>${element['title']}</b>
        </div>
        <div>
            <p class="description-font">${element['description']}</p>
        </div>
        <div class="progress-task">
            <div class="progressbar"></div>
            <div class="subtask-display">0/0 Subtasks</div>
        </div>
    </div>`;
}

// Beispiel für das Hinzufügen von Unteraufgaben zu einer Aufgabe
board[0].subtasks = [
    { id: 1, title: 'Subtask 1', done: true },
    { id: 2, title: 'Subtask 2', done: false },
];

// Beispiel für das Aktualisieren der Fortschrittsleiste und Anzeige für Subtasks
updateProgressBar(0);





function allowDrop(ev) {
    ev.preventDefault();
}

function moveTo(category) {
    board[currentDraggedElement]['category'] = category;
    updateHTML();
}

function highlight(id) {
    document.getElementById(id).classList.add('drag-area-highlight');
}

function removeHighlight(id) {
    document.getElementById(id).classList.remove('drag-area-highlight');
}


// render funktion wenn man eine neue task hinzufügen will

function addTask(){

}


// Funktion für addTask um Category auszuwählen

function showTaskSelect(selectedOption) {
    let taskSelectCategory = document.getElementById('task-select-category');
    let arrowDownImg = document.getElementById('arrow_down');
    let arrowUpImg = document.getElementById('arrow_up');
    let taskCategoryInput = document.getElementById('task-category-input');

    let isVisible = !taskSelectCategory.classList.contains('d-none');// Überprüfe, ob der Container bereits sichtbar ist
    taskSelectCategory.classList.toggle('d-none');// Füge oder entferne die 'd-none'-Klasse basierend auf dem aktuellen Zustand

    // Füge oder entferne die 'd-none'-Klasse für die Pfeilbilder
    arrowDownImg.classList.toggle('d-none', !isVisible);
    arrowUpImg.classList.toggle('d-none', isVisible);

    let selectedText = selectedOption.innerText;  // Extrahiere den ausgewählten Text aus dem angeklickten Element
    taskCategoryInput.value = selectedText; // Setze den ausgewählten Text in die Input-Fläche
}



// Funtion damit man einzelne subtasks eingeben und anzeigen kann

function addSubtask() {
    // Input-Feld und Subtask-Div abrufen
    let inputSubtasks = document.getElementById('input-subtasks');
    let ulElement = document.getElementById('unsorted-list');

    // Wert des Input-Felds abrufen
    let subtaskText = inputSubtasks.value.trim();

    // Wenn das Input-Feld nicht leer ist
    if (subtaskText !== '') {
        // Neues LI-Element erstellen und den Subtask-Text einfügen
        let liElement = document.createElement('li');
        liElement.textContent = subtaskText;

        // Container für Bearbeiten und Löschen erstellen
        let actionContainer = document.createElement('div');
        actionContainer.classList.add('subtask-img');

        // Bilder für Bearbeiten und Löschen erstellen
        let editImg = document.createElement('img');
        editImg.src = "/assets/img/board/editforSubtask.png";
        editImg.alt = "Edit";
        editImg.onclick = editSubtask;

        let deleteImg = document.createElement('img');
        deleteImg.src = "/assets/img/board/trashforsubtasks.png";
        deleteImg.alt = "Delete";
        deleteImg.onclick = deleteSubtask;

        // Bilder dem Container hinzufügen
        actionContainer.appendChild(editImg);
        actionContainer.appendChild(deleteImg);

        // LI-Element dem UL-Element hinzufügen
        liElement.appendChild(actionContainer);
        ulElement.appendChild(liElement);

        // Input-Feld leeren
        inputSubtasks.value = '';
    }
}

// Funktion zum Testen, um Subtasks zu löschen
function deleteSubtask() {
    let liElement = this.closest('li'); // Das übergeordnete LI-Element finden
    liElement.parentNode.removeChild(liElement);
}

// Funktion zum Testen, um Subtasks zu bearbeiten
function editSubtask() {
    // Den Text des ausgewählten Subtasks abrufen
    let subtaskTextElement = this.parentNode.parentNode;
    let subtaskText = subtaskTextElement.firstChild.nodeValue;

    // Einen neuen Input für die Bearbeitung erstellen
    let inputElement = document.createElement('input');
    inputElement.type = 'text';
    inputElement.value = subtaskText;

    // Einen Button zum Akzeptieren der Bearbeitung erstellen
    let acceptButton = document.createElement('img');
    acceptButton.src = "/assets/img/board/done.png";
    acceptButton.style = "cursor: pointer; background-color: white; border-radius: 15px;";
    acceptButton.alt = "Done";
    acceptButton.onclick = function () {
        // Den bearbeiteten Text übernehmen
        subtaskTextElement.firstChild.nodeValue = inputElement.value;

        // Bilder für Bearbeiten und Löschen wieder anzeigen
        let subtaskImgContainer = subtaskTextElement.querySelector('.subtask-img');
        subtaskImgContainer.classList.remove('d-none');

        // Das Eingabefeld und den "Done"-Button entfernen
        subtaskTextElement.removeChild(inputElement);
        subtaskTextElement.removeChild(acceptButton);
    };

    // Bilder für Bearbeiten und Löschen ausblenden
    let subtaskImgContainer = subtaskTextElement.querySelector('.subtask-img');
    subtaskImgContainer.classList.add('d-none');

    // Das Eingabefeld und den "Done"-Button dem Subtask-Element hinzufügen
    subtaskTextElement.appendChild(inputElement);
    subtaskTextElement.appendChild(acceptButton);
}

function createTask(){
    
}