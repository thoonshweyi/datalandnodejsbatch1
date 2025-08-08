const fs = require("fs");

// => Synchronous 
try{
    fs.mkdirSync('./newfolderone/abc/eft',{recursive:true});
    console.log("Directory created successfully");
}catch(err){
    console.log("Error creating directory.");
}


// => Asynchronous
fs.mkdir('./newfoldertwo',{recursive:true},(err)=>{
    // if(err){
    //     console.error(    "Error creating directory: ",err)
    //     return;
    // }

    if(err) throw err;

    console.log("Directory created by async.")
});


// => Create Nested Directories
// => Synchronous 
try{
    fs.mkdirSync('./newfolderthree/folder1/folder2',{recursive:true});
    console.log("Nested Directory created successfully");
}catch(err){
    console.log("Error creating directory.");
}


// => Asynchronous
fs.mkdir('./newfolderfour/folder1/folder2',{recursive:true},(err)=>{
    if(err) throw err;

    console.log("Nested Directory created by async.")
});


// => Rename Directory (create first main, data)
// => Synchronous
// try{
//     fs.renameSync("./main","./assets")
//     console.log("Directory renamed successfully");
// }catch(err){
//     console.log("Error renaming directory.");
// }

// => Asynchronous
// fs.rename('./data','./libs',(err)=>{
//     if(err) throw err;

//     console.log("Directory renamed by async.");
// })

// => Remove Directory (create first main, data)
// => Synchronous
try{
    fs.rmSync("./assets",{recursive:true,force:true});
    console.log("Directory removed successfully");
}catch(err){
    console.log("Error removing directory.");
}

// => Asynchronous
fs.rm('./libs',{recursive:true,force:true},(err)=>{
    if(err) throw err;

    console.log("Directory removed by async.");
})


// ----------------------------------------------------------------------------

// => Check file exists or not 

if(fs.existsSync('index.js')){
    console.log("Index file exists");
}else{
    console.log("index file does not exist");
}

// => Check directory exists or not 
if(fs.existsSync('newfolderone')){
    console.log("newfolderone folder exists");
}else{
    console.log("newfolderone does not exist");
}


// => Read contents of a Directory
fs.readdir(".",(err,files)=>{
    if(err) throw err;

    console.log("Directory contents: ", files) // Directory contents:  ['index.js','newfolderfour', 'newfolderone', 'newfolderthree','newfoldertwo']
    files.forEach(file=>{
        console.log(file);
    })
})

// Note: {withFileTypes:true}, return Dirent Object
fs.readdir(".",{withFileTypes:true},(err,files)=>{

    // files.forEach(file=>{
    //     console.log(file, file.isDirectory() ? "Directory" : "File");
    // }) //*Error // reas as string array

    if(err) throw err;

    console.log("Directory contents: ", files) // obj // Directory contents:  [Dirent { name: 'index.js', parentPath: '.', Symbol(type): 1 }, Dirent { name: 'newfolderfour', parentPath: '.', Symbol(type): 2 },Dirent { name: 'newfolderone', parentPath: '.', Symbol(type): 2 },Dirent { name: 'newfolderthree', parentPath: '.', Symbol(type): 2 },Dirent { name: 'newfoldertwo', parentPath: '.', Symbol(type): 2 }]

    files.forEach(file=>{
        console.log(file.name,file.isDirectory() ? "Directory" : "File");
    });
});

fs.stat('./newfolderone',(err,stats)=>{
    if(err) throw err;
    // console.log(stats);

    console.log("Is file: ",stats.isFile())
    console.log("Is directory: ",stats.isDirectory())

   
});


// fs.mkdirSync(path,{recursive:true})
// fs.mkdir(path,{recursive:true},callback(err,data))

//  fs.renameSync(path_old,path_new);
//  fs.rename(path_old,path_new,callback(err,data));

// fs.rmSync(path,{recursive:true,force:true})
// fs.rm(path,{recursive:true,force:true},callback(err,data))

// fs.existsSync(file path or directory path)

// fs.readdir(path, {withFileTypes:true}, callback(err,files))

