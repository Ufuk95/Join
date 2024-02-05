

/**
 * Gets sign up data from remote storage as json array. 
 */
async function remoteSignUpData() {
  signUpData = JSON.parse(await getItem("userData"));
  console.log(signUpData);
}


// async function giveMeTask(){
//   let myItems = await getItem("tasks")
//   let parsedMyItems = JSON.parse(myItems);
// }

let ContactsDummyData = [
  ["Dennis Schmidt", "john.doe@gmail.com", "01778334899"],
  ["Alice Schenger", "alice.smith@web.de", "01768354332"],
  ["Bob Ross", "bob.johnson@gmx.net", "01758318932"],
  ["Emily Scholz", "emily.davis@gmx.de", "01658325432"],
  ["Daniel", "daniel.clark@yahoo.com", "017782332523"],
]