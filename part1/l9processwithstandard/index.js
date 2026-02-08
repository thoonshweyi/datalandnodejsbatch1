// => Process with Standard Input/ Output/ Error

// standard input 
// process.stdin( standard input )
// process.stdout( standard output )
// process.stderr( standard error )

// => process.stdout
process.stdout.write("Hello \n")
process.stdout.write("Mandalay")
process.stdout.write("\n")

// => Get Terminal Size
console.log("Terminal Width: ",process.stdout.columns);
console.log("Terminal Height: ",process.stdout.rows);


// => clearLine(0), cursorTo(0)

// exe1 (progress bar)
// let progress = 0;

// const proginvl = setInterval(()=>{
//     process.stdout.clearLine(0);
//     process.stdout.cursorTo(0);

//     process.stdout.write(`Progress: ${progress} %`)
//     progress += 10;

//     if(progress > 100){
//         clearInterval(proginvl);
//         process.stdout.write("\n");
//     }
// },300)
// console.log("I am printing....")

// => process.stdin (asynchronous)

// on vs once
// once() it better for we only expec one input 
// on() for more input
//   -asynchronous

// exe 1
// console.log("Type your name and press Enter: ");
// process.stdin.setEncoding("utf8")
// process.stdin.on("data",(data)=>{
//     const getname = data.toString().trim();
//     console.log(`Your name is ${getname}`);
//     process.exit(0);
// })
// console.log("I am working....")


// exe 2
// console.log("Do you like iPhone? (yes/no)")
// process.stdin.once("data",(data)=>{
//     const getanswer = data.toString().trim().toLowerCase();

//     if(getanswer == "yes"){
//         console.log("Awesome");
//     }else{
//         console.log("Maybe you'll like it later.")
//     }
//     process.exit(0);
// })

// => process.stderr
// process.stderr.write("Error, Something went wrong\n");

process.stderr.write("Error, Cannot connect to database \n");
process.exit(1);
console.log("I am doing");
// 11SD