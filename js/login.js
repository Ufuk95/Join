let users = [
    {'email': 'test129@web.de',
    'password': 'test12345'}
]

function login() {
    let email = document.getElementById('email');
    let password = document.getElementById('password');

    let user = users.find(u => u.email == email.value && u.password == password.value);
    console.log(user);
    if (user) {
        console.log('user gefunden')
    }
}


// const urlParams = new URLSearchParams(window.location.search);
// const msg = urlParams.get('msg');

// if (msg) {
//     msgBox = document.getElementById('msgBox');
//     msgBox.innerHTML = msg
// } else {
//     // display: none;
// }