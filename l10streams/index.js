// const fs = require('fs')
const fs = require('node:fs');
const http = require("node:http");
const path = require("node:path");
// exe 1
// const readstream1 = fs.createReadStream('./datafiles/postone.txt');


// readstream1.on('data',(chunk)=>{
//     console.log(chunk);                     // <Buffer 74 68 69 73 20 69 73 20 6e 65 77 20 70 6f 73 74 20 6f 6e 65 2e>
//     console.log('length: ',chunk.length);   // length:  21

//     console.log(chunk.toString());          // this is new post one.

// })

// readstream1.on('end',()=>{
//     console.log("Stream excel ended");
// });

// readstream1.on('error',(err)=>{
//     console.log("Read error: ",err.message);
// })

// // exe 2
// const readstream2 = fs.createReadStream('./datafiles/posttwo.txt');
// readstream2.setEncoding("utf8")

// readstream2.on('data',(chunk)=>{
//     console.log(chunk);                     // <Buffer 74 68 69 73 20 69 73 20 6e 65 77 20 70 6f 73 74 20 6f 6e 65 2e>
//     console.log('length: ',chunk.length);   // length:  21

//     console.log(chunk.toString());          // this is new post one.

// })

// readstream2.on('end',()=>{
//     console.log("Stream exe2 ended");
// });

// readstream2.on('error',(err)=>{
//     console.log("Read error: ",err.message);
// })

// exe 3
// const readstream3 = fs.createReadStream('./datafiles/postthree.txt',{encoding:'utf-8'});

// readstream3.on('data',(chunk)=>{
//     console.log(chunk);                     // this is new post three.
//     console.log('length: ',chunk.length);   // length:  21
//     console.log(chunk.toString());          // this is new post one.

// })

// readstream3.on('end',()=>{
//     console.log("Stream exe3 ended");
// });

// readstream3.on('error',(err)=>{
//     console.log("Read error: ",err.message);
// })

// exe 4 (highWaterMark)
// const readstream4 = fs.createReadStream('./datafiles/article.txt',{
//     encoding:'utf-8',
//     highWaterMark: 8 // bytes per chunk
// });

// readstream4.on('data',(chunk)=>{
//     console.log(chunk);                     // this is new post three.
//     console.log('length: ',chunk.length);
// })

// readstream4.on('end',()=>{
//     console.log("Stream exe4 ended");
// });

// readstream4.on('error',(err)=>{
//     console.log("Read error: ",err.message);
// })

// exe 5 Pause/Resume
// const readstream5 = fs.createReadStream('./datafiles/announcement.txt',{encoding:'utf-8'});
// let bytes = 0;

// readstream5.on('data',(chunk)=>{
//     // console.log(chunk);  // this is new announcement one
//     // console.log('length: ',chunk.length); // 28

//     bytes += Buffer.byteLength(chunk,'utf-8');
//     console.log("Total bytes = ",bytes) // Total bytes =  28

//     readstream5.pause();

//     setTimeout(()=>readstream5.resume(),2000)
// });

// readstream5.on('end',()=>{
//     console.log("Stream exe5 ended");
// });

// readstream5.on('error',(err)=>{
//     console.log("Read error: ",err.message);
// })

// -----------------------------------------------------------------------------
// => pipe() to a writable stream (copy a file)

// exe1
// const rs1 = fs.createReadStream('./datafiles/news.txt');
// const ws1 = fs.createWriteStream('./datafiles/news-one.txt');

// rs1.pipe(ws1);
// ws1.on('finish',()=>console.log("Copy Finished"));
// rs1.on('error',(err)=>console.error("Read Error",err));
// ws1.on('error',(err)=>console.error("Write Error",err));

// exe2
// const rs2 = fs.createReadStream('./datafiles/news.txt',{encoding:"utf-8"});
// const ws2 = fs.createWriteStream('./datafiles/news-two.txt');

// rs2.pipe(ws2);

// ws2.on('finish',()=>console.log("Copy Finished"));
// rs2.on('error',(err)=>console.error("Read Error",err));
// ws2.on('error',(err)=>console.error("Write Error",err));

// exe3 (write())
// const rs3 = fs.createReadStream('./datafiles/news.txt',{encoding:"utf-8"});
// const ws3 = fs.createWriteStream('./datafiles/news-three.txt');


// rs3.on('data',(chunk)=>{
//     // console.log(chunk);
//     // console.log(chunk.toString());

//     ws3.write('\n New Chunk \n')
//     ws3.write(chunk)
// })

// ws3.on('finisih',()=>console.log("Copy Finished"));
// rs3.on('error',(err)=>console.error("Read Error",err));
// ws3.on('error',(err)=>console.error("Write Error",err));

// exe4 (stream a file to HTTP)

const server = http.createServer((req,res)=>{
    const filepath = path.join(__dirname,"datafiles/newss.txt");
    
    const rs4 = fs.createReadStream(filepath);

    rs4.on("open",()=>{
        res.writeHead(200,{"Content-Type":"text/plain"});
        // res.writeHead(200,{"Content-Type":"application/pdf"}); // Error
        rs4.pipe(res);
    });

    rs4.on("error",(err)=>{
        res.writeHead(404,{"Content-Type":"text/plain"});
        res.end(`Not Found: ${err.message}`) // Not Found: ENOENT: no such file or directory, open 'D:\datalandcouses\nodejsbatch1\l10streams\datafiles\newss.txt'
    });
});
server.listen(3000,()=>console.log("server is working. http://localhost:3000"));

