const readline = require("readline");

// => exe1 
// const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout
// });

// rl.question("What is your name?",(name)=>{
//     console.log(`Hello, ${name}`);
//     rl.close();
// });

// exe2 (munti questions)
// const rl = readline.createInterface({input: process.stdin,output: process.stdout});
// rl.question("Name: ",(name)=>{
//     rl.question("Age: ",(age)=>{
//         console.log(`Name: ${name}, Age: ${age}`);
//         rl.close();
//     });
// });

// exe2 (munti questions with async await)


// function questionAsync(rl,prompt){
//     return new Promise(resolve=>rl.question(prompt,resolve))
// }
// async function main(){
//     const rl = readline.createInterface({input: process.stdin,output: process.stdout});

//     const name = await questionAsync(rl,"Name: ");
//     const city = await questionAsync(rl,"City: ");

//     console.log(`Hello ${name} from ${city}`);
//     rl.close();
// }
// main();

// => exe4 loop 
// function questionAsync(rl,prompt){
//     return new Promise(resolve=>rl.question(prompt,resolve))
// }
// async function main(){
//     const rl = readline.createInterface({input:process.stdin,output:process.stdout});

//     let num;

//     while(true){
//         const answer = await questionAsync(rl,"Enter a number (1 to 10): ");

//         num = Number(answer);

//         if(!Number.isNaN(num) && num >= 1 && num <= 10) break;

//         console.log("Invalid: try again");
//     }
//     console.log(`You choose: ${num}`);
//     rl.close();
// }
// main();

// => exe5 rl.prompt() and "line" event and "close" event
 const rl = readline.createInterface({input:process.stdin,output:process.stdout});
 const todos = [];

 rl.prompt()
 console.log("Commands: help, add [your task], list, exit");
 rl.prompt()

 rl.on('line',(line)=>{
    const input = line.trim();

    if(input == 'help'){
         console.log(" help - show this \n add [your task] - add your task \n list - show all tasks \n exit - quit.");
    }else if(input.startsWith('add ')){

        todos.push(input.slice(4));
        console.log("New task successfully added.");
    }else if(input == 'list'){
        console.log(todos.length ? todos.map((todo,idx)=>`${idx+1}. ${todo}`).join("\n") : `No todo!`)
    }else if(input == "exit"){
        rl.close();
    }else{
        console.log(`Unknown Command. Type "help"`);
    }

    rl.prompt();
 });

 rl.on('close',()=>{
    console.log("Goodbye!");
    process.exit(0);
 });