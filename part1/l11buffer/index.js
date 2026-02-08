const fs = require("node.fs")

// => Buffer (string or arrays)
// exe 1
const buff1 = Buffer.from("Hello Bago");
console.log("Buffer: ",buff1); // Buffer:  <Buffer 48 65 6c 6c 6f 20 42 61 67 6f>
console.log("Buffer Length: ",buff1.length); // Buffer Length:  10
console.log("String: ",buff1.toString()); // String:  Hello Bago

// exe 2
const buff2 = Buffer.from("Hello Mawlamyine","utf-8");
console.log("Buffer: ",buff2); // Buffer:  <Buffer 48 65 6c 6c 6f 20 4d 61 77 6c 61 6d 79 69 6e 65>
console.log("Buffer Length: ",buff2.length); // Buffer Length:  16
console.log("String: ",buff2.toString()); // String:  Hello Mawlamyine


// exe 3
const buffa = Buffer.from("Hello "); 
const buffb = Buffer.from("Myanmar "); 
const buffc = Buffer.from("Country! "); 

const joined = Buffer.concat([buffa,buffb,buffc])
console.log(joined) // <Buffer 48 65 6c 6c 6f 20 4d 79 61 6e 6d 61 72 20 43 6f 75 6e 74 72 79 21 20>
console.log(joined.toString()) // Hello Myanmar Country!

// => stream vs buffer
// stream
// large file

// buffer - memory hand, memory overload
// light weight file 
// -----------------------------------------------
// exe 4 (Buffer and Stream)

const rs4 = fs.createReadStream("./datafiles/announcement.txt");
let chunks = [];

rs4.on("data",chunk=> chunks.push(chunk));
rs4.on('end',()=>{
})
