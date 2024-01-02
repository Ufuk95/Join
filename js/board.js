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

    // Überprüfe, ob der Container bereits sichtbar ist
    let isVisible = !taskSelectCategory.classList.contains('d-none');

    // Füge oder entferne die 'd-none'-Klasse basierend auf dem aktuellen Zustand
    taskSelectCategory.classList.toggle('d-none');

    // Füge oder entferne die 'd-none'-Klasse für die Pfeilbilder
    arrowDownImg.classList.toggle('d-none', !isVisible);
    arrowUpImg.classList.toggle('d-none', isVisible);

    // Extrahiere den ausgewählten Text aus dem angeklickten Element
    let selectedText = selectedOption.innerText;

    // Setze den ausgewählten Text in die Input-Fläche
    taskCategoryInput.value = selectedText;
}




