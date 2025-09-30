const { Console } = require("console");
const fs = require("fs");

// => Check File
// => Synchronous 
    try{
        fs.accessSync("./assets/postone.txt",fs.constants.F_OK)
        console.log("File exists")
    }catch(err){
        console.log("File does not exists.")
    }

// => Asynchronous 
    fs.access("./assets/postone.txt",fs.constants.F_OK,(err)=>{
        if(err){
            console.log('File does not exists by async')
            return;
        }

        console.log("File exists by async");
    });

// => File Info (Statistics) 

fs.stat('./assets/postone.txt',(err,stats)=>{
    if(err){
        console.error("Error stats, ",err);
        return;
    }
    console.log(stats);

    console.log("File Stats ",{
        filesize: stats.size + 'bytes',
        createdAt: stats.birthtime,
        updatedAt: stats.mtime,

        isfile: stats.isFile(),
        isdirectory: stats.isDirectory()
    })
});

// => Read File
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


// => Write File 
// => Synchroous 
const content = "This is new article.";
try{
    fs.writeFileSync("./datafiles/articleone.txt",content);
    console.log("File created and written successfully");
}catch(err){
    console.log("Error writing file.");
}

// => Asynchronous
fs.writeFile("./datafiles/articletwo.txt",content,()=>{
    console.log("File created and written successfully by async");
})

// Append File 
const newcontent = "\nAppended content text."
try{
    fs.appendFileSync("./datafiles/articleone.txt",newcontent);
    console.log("File Content appended successfully.")
}catch(err){
    console.log("Error writing file.",err);
}

// Asynchronous
fs.appendFile("./datafiles/articletwo.txt",newcontent,(err)=>{
    if(err){
        console.log("Error appending: ", err)
    }
     console.log("Content append successfully.")
})

// => Rename File
// Synchronous
try{
    fs.renameSync("./datafiles/articleone.txt",'./datafiles/articleOne.txt');
    console.log("File renamed successfully");
}catch(err){
    console.log("Error renaming file",err);
}

// Asynchronous
fs.rename("./datafiles/articletwo.txt","./datafiles/articleTwo.txt",(err)=>{
    if(err){
        console.log("Error renaming file:",err);
        return;
    }
    console.log("File renamed successfully by async");
});

// Delete File
// => Synchronous
    try{
        if(fs.existsSync("./datafiles/articleOne.txt")){
            fs.unlinkSync("./datafiles/articleOne.txt")
            console.log("File deleted successfully");
        }
        
    }catch(err){
         console.log("Error deleting file:",err);
    }
// => Asynchronous
    fs.unlink("./datafiles/articleTwo.txt",(err)=>{
        if(err){

            if(err.code == "ENOENT"){
                console.log("File does not exist by async")
            }else{
                console.log("Error deleting file:", err);
            }
            return;
        }
        console.log("File deleted successfully by async");
    });

// Stats {
//   dev: 2986372771,
//   mode: 33206,
//   nlink: 1,
//   uid: 0,
//   gid: 0,
//   rdev: 0,
//   blksize: 4096,
//   ino: 281474976713519,
//   size: 29,
//   blocks: 0,
//   atimeMs: 1753112590923.6792,
//   mtimeMs: 1753007553093.8606,
//   ctimeMs: 1753007553093.8606,
//   birthtimeMs: 1752509437386.122
// }

// fs.accessSync(path, keyword)
// fs.access(path, keyword, callback(err))
// Note: fs.constants.F_OK = Cross-Platform consistency. way to check existence across

// fs.stat(path,charcode)


// fs.readFileSync(path,callback(err,data))
// fs.readFileSync(path,charcode,callback(err,data))

// fs.writeFileSync(path,content,callback)
// fs.writeFile(path,content,callback)

// fs.appendFileSync(path,newcontent)
// fs.appendFileSync(path,newcontent,callback)

//  fs.renameSync(path_old,path_new);
//  fs.rename(path_old,path_new,callback);


// fs.unlinkSynct(path)
// fs.unlinkSynct(path,callback)
