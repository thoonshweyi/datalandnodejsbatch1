// => without Streamin

const http = require("http");
const fs = require('fs');
const path = require('path');

const filepath = path.join(__dirname,"paragraph.txt");
const PORT = 3000;

const server = http.createServer((req,res)=>{
    if(req.url === '/file'){
        try{
            const data = fs.readFileSync(filepath,'utf8');
            res.writeHead(200,{
                'Content-Type': "text/plain;charset=utf-8",
                'Content-Length': Buffer.byteLength(data)
            })
            res.end(data);
        }catch(err){
            res.writeHead(404).end("File not found.");
        }
    }else{
        res.writeHead(200).end('Go to : http://localhost:3000/file');
    }
});
server.listen(PORT,'localhost',()=>{
    console.log(`Server running at http://localhost:${PORT}`);
});