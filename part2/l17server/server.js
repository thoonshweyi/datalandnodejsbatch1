const http = require("http");
const fs = require("fs");
const PORT = 3001;


const server = http.createServer((req,res)=>{
    // console.log(req.url) // / or /about
    // console.log(req.method); 
    // console.log(req.headers)

    res.setHeader("Content-Type",'text/html', 'charset=utf-8');

    let url;
    try{
        url = new URL(req.url,`http://${req.headers.host}`);
    }catch(err){
        console.log("Error URL: ",err);
        res.statusCode = 400;
        res.end("Bad request");
        return;
    }

    console.log(url);
    console.log(url.pathname);
    let path = "./views/";
    let statusCode = 200;

    if(req.method === "GET" && url.pathname === "/"){
        path+= "index.html";
        statusCode = 200;
    }else if(req.method === "GET" && url.pathname === "/about"){
        path+= "about.html";
        statusCode = 200;
    }else if(req.method === "GET" && url.pathname === "/about-us"){
        res.setHeader("Location",'/about'); 
        res.statusCode = 301;
        res.end();
        return;
    }else{
        path += "404.html";
        statusCode = 404;
    }
    fs.readFile(path,(err,data)=>{
        if(err){
            console.error(err);
            res.end();
        }else{
            // res.statusCode = statusCode;
            // res.write(data);
            // res.end();

            res.statusCode = statusCode;
            res.end(data);
        }

    })
});



server.listen(PORT,'localhost',()=>{
    console.log(`Server is running. http://localhost:${PORT}`);
})

