let todos = [{
  'id': 0,
  'title': 'Putzen',
  'category': 'open'
}, {
  'id': 1,
  'title': 'Kochen',
  'category': 'open'
}, {
  'id': 2,
  'title': 'Einkaufen',
  'category': 'closed'
}];

function updateHTML() {
  // Hier wird die methode filter auf das JSON array todos angewendet.
  // Diese Methode erhält eine arrow function mit einem Parameter. 
  // Wenn die "category" in einem object "open" ist, wird das object behalten 
  // Es wird ein neues array gebildet indem nur die items überbleiben die in der 
  // funktion true ergeben.
  let open = todos.filter(t => t['category'] == 'open');
  // open wird erstmal geleert. 
  document.getElementById('open').innerHTML = '';
  // Und wieder mit allen items befüllt die open enthalten. 
  for (let index = 0; index < open.length; index++) {
    const element = open[index];
    document.getElementById('open').innerHTML += generateTodoHTML(element);
  }
  
  let closed = todos.filter(t => t['category'] == 'closed');
  document.getElementById('closed').innerHTML = '';
  for (let index = 0; index < closed.length; index++) {
    const element = closed[index];
    document.getElementById('closed').innerHTML += generateTodoHTML(element);
  }
}

// Hier wird ein einzelnes Object übergeben
function generateTodoHTML(element) {
  return `<div draggable="true" ondragstart="startDragging(${element['id']})" class="todo">${element['title']}</div>`;
}