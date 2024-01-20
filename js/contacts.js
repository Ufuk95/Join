
// Example of Dialog appearing.
function addTask(field) {
  let taskcard = document.getElementById("full-task-card");
  taskcard.classList.remove("d-none");
  setTimeout(function () {
    taskcard.classList.add("open");
  }, 0);
}


async function setHardcodedData(){
  await setItem("userData", ContactsDummyData)
}

setHardcodedData()

async function logUserData(){
  let userData =  JSON.parse(await getItem("userData")); 
  console.log(userData);
  console.log(userData.length);
}

logUserData()