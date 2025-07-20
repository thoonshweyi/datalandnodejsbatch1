const fs = require("fs");

// => Synchronous file read
try{
    const data = fs.readFileSync("./assets/postone.txt","utf8")
    console.log("File content: ",data);
}catch(err){
    console.error("Error Found: ",err)
}
console.log("This is final call 1")

// // => Asynchronous File Read 
fs.readFile("./assets/postone.txt",'utf-8',(err,data)=>{
    if(err){
        console.log("Error Found: ",err)
    }
    // console.log(data) // <Buffer 54 68 69 73 20 69 73 20 6e 65 77 20 41 72 74 69 63 6c 65 20 70 6f 73 74 20 6f 6e 65 2e>
    console.log(data.toString());
});
console.log("This is final call 2")






// fs.readFileSync(path,charcode)
// fs.readFileSync(path,charcode,callback(err,data))
