const http = require("http");
const fs = require("fs");

const server = http.createServer((req,res)=>{
    res.setHeader("Content-Type",'text/html');

    let path = "./views/";

    // console.log(req.url);

    switch(req.url){
        case '/': 
            path += "index.html";
            res.statusCode = 200;
            break;
        case '/about': 
            path += "about.html";
            res.statusCode = 200;
            break;
        case '/about-us':
            res.setHeader("Location",'/about'); 
            res.statusCode = 301;
            res.end();
            break;
        default:
            path += "404.html";
            res.statusCode = 404;
            break;
    }
    fs.readFile(path,(err,data)=>{
        if(err){
            console.error(err);
            res.end();
        }else{
            // res.write(data);
            // res.end();


            res.end(data);
        }

    })
});

server.listen(3000,'localhost',()=>{
    console.log("Server is running.");
})


// redirect
// about-us = 301 Moved Permanently
// about    = 200 OK