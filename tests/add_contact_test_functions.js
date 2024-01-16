
let alphabet = "abcdefghijklmnopqrstuvwxyz";

let unsortedArray = ["u", "b", "v", "a", "x"];

console.log(unsortedArray.sort());

let incomingNames = [["Adrian Bitea", "addi@addi.de"], ["Bebel", "bebel@gmx.de"]];
let incomingNamesOject = [{}]

let sortedFornamesA = {
  "x": [],
  "a": [["Name", "email"]],
  "b": [],
  "c": ["u"],
  "k": [],
  "g": []
};


console.log(Boolean("u" in sortedFornamesA));

sortedFornamesA["k"] = [["katharina"]];

for (let i = 0; i < incomingNames.length; i++) {
  let letterKey = incomingNames[i][0][0].toLowerCase();
  sortedFornamesA[letterKey].push(incomingNames[i]);
}

let fornamesArrayOfArrays = Object.entries(sortedFornamesA)

console.log(fornamesArrayOfArrays);
console.log(fornamesArrayOfArrays.sort())