const http = require("http");

const server = http.createServer((req,res)=>{
    // console.log("request completed");

    // console.log(req)
    // console.log(req.method); // GET

    // set header content type 
    // res.setHeader("Content-Type",'text/plain');
    // res.write("hello nodejs");
    // res.end();

    res.setHeader("Content-Type",'text/html');
    res.write("<head><link href=''  rel='stylesheet' /></head>");
    res.write('<h5>Hello Nodejs</h5>');
    res.write('<p>welcome to javascript class</p>')
    res.end();
});

server.listen(3000,'localhost',()=>{
    console.log("server is running.");
})