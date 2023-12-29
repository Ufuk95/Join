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

function generateTaskHTML(element) {
    return `
    <div draggable="true" ondragstart="startDragging(${element['id']})" class="task">
        <div>
            <b>${element['title']}</b>
        </div>
        <div>
            <p class="description-font">${element['description']}</p>
        </div>
    </div>`;
}

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