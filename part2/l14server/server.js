const http = require("http");
const fs = require("fs");

const server = http.createServer((req,res)=>{
    res.setHeader("Content-Type",'text/html');

    // read file async
    fs.readFile('./views/index.html','utf-8',(err,data)=>{
        if(err){
            console.log(err);
            res.end();
        }else{
            // method 1
            // res.write(data);
            // res.end();

            // method 2
            res.end(data)
        }
    });
});

server.listen(3000,'localhost',()=>{
    console.log("Server is running.");
})
