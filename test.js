const parentString = "tabahademulya";

let numberOfOutput = 13;

for(let i = 0; i< numberOfOutput; i++) {
    let outputString = parentString.substring(i) + parentString.replace(parentString.substring(i), "")
    console.log(outputString)
}