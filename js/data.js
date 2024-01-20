

/**
 * Gets sign up data from remote storage as json array. 
 */
async function remoteSignUpData(){
  signUpData = JSON.parse(await getItem("userData"))
  console.log(signUpData);
}


// async function giveMeTask(){
//   let myItems = await getItem("tasks")
//   let parsedMyItems = JSON.parse(myItems);
// }

let ContactsDummyData = [
  {
    name: "Dennis Schmidt",
    email: "john.doe@gmail.com"
  },
  {
    name: "Alice Schenger",
    email: "alice.smith@web.de"
  },
  {
    name: "Bob Ross",
    email: "bob.johnson@gmx.net"
  },
  {
    name: "Emily Scholz",
    email: "emily.davis@gmx.de"
  },
  {
    name: "Daniel",
    email: "daniel.clark@yahoo.com"
  }];
