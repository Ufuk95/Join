let board = [{
    'id': 0,
    'title': 'Putzen',
    'category': 'todo'
}, {
    'id': 1,
    'title': 'Kochen',
    'category': 'in-progress'
}, {
    'id': 2,
    'title': 'Einkaufen',
    'category': 'await-feedback'
}, {
    'id': 3,
    'title': 'Einkaufen',
    'category': 'done'
}];

let currentDraggedElement;

function updateHTML() {
    let todo = board.filter(t => t['category'] == 'todo');

    document.getElementById('todo').innerHTML = '';

    for (let index = 0; index < todo.length; index++) {
        const element = todo[index];
        document.getElementById('todo').innerHTML += generateTodoHTML(element);
    }

    let in_progress = board.filter(t => t['category'] == 'in-progress');

    document.getElementById('in-progress').innerHTML = '';

    for (let index = 0; index < in_progress.length; index++) {
        const element = in_progress[index];
        document.getElementById('in-progress').innerHTML += generateTodoHTML(element);
    }

    let await_feedback = board.filter(t => t['category'] == 'await-feedback');

    document.getElementById('await-feedback').innerHTML = '';

    for (let index = 0; index < await_feedback.length; index++) {
        const element = await_feedback[index];
        document.getElementById('await-feedback').innerHTML += generateTodoHTML(element);
    }

    let done = board.filter(t => t['category'] == 'done');

    document.getElementById('done').innerHTML = '';

    for (let index = 0; index < done.length; index++) {
        const element = done[index];
        document.getElementById('done').innerHTML += generateTodoHTML(element);
    }
}

function startDragging(id) {
    currentDraggedElement = id;
}

function generateTodoHTML(element) {
    return `<div draggable="true" ondragstart="startDragging(${element['id']})" class="todo">${element['title']}</div>`;
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