// const getstudents = require('./student.js')
// const getstudents = require('./student')
// console.log(getstudents) // {}
// -----------------------------------------

// const getstudents = require("./students.js");
// console.log(getstudents)

// -----------------------------------------

// Note: before export {}
// const getstudents = require("./students.js");
// console.log(getstudents);
// -----------------------------------------

// const getstudents = require("./students.js");
// console.log(getstudents);
// console.log(getstudents.students);
// console.log(getstudents.ages);


const {students,ages} = require("./students.js");
console.log(students);
console.log(ages);