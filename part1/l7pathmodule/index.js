console.log("Directory Global Variables: ",__dirname); // Directory Global Variables:  D:\datalandcouses\nodejsbatch1\l7pathmodule

// => Path Module
const pathModule = require("path");

// => Get directory name from a file path, dirname()
const filepath = "D:\\datalandcouses\\nodejsbatch1\\l7pathmodule\\index.js";
const dirname = pathModule.dirname(filepath);
console.log("Directory: ",dirname); // Directory:  D:\datalandcouses\nodejsbatch1\l7pathmodule

// => Get file name from a file path, basename()
const fileurl = "D:\\datalandcouses\\nodejsbatch1\l7pathmodule\\index.js";
const filename = pathModule.basename(fileurl);
console.log("File name: ",filename); // File name:  index.js


// => Get file name without extension from a file path, basename()
const filelink = "D:\\datalandcouses\\nodejsbatch1\l7pathmodule\\index.js";
const filenamewithoutext = pathModule.basename(filelink,".js");
console.log("File name without extension: ",filenamewithoutext); // File name without extension:  index


// => Get file extension from a file path, extname()
const fileroute = "D:\\datalandcouses\\nodejsbatch1\\l7pathmodule\\index.js";
const getextension = pathModule.extname(fileroute);
console.log("File extension: ",getextension); // File extension:  .js


console.log("Separator: ",pathModule.sep); // Separator:  \
console.log("Delimiter: ",pathModule.delimiter); // Delimiter:  ;

// => split()
const url = "D:\\datalandcouses\\nodejsbatch1\\l7pathmodule\\index.js";
const segments = url.split(pathModule.sep);
console.log(segments); // [ 'D:', 'datalandcouses', 'nodejsbatch1', 'l7pathmodule', 'index.js' ]


// => parse()
const rootURL = "D:\\datalandcouses\\nodejsbatch1\\l7pathmodule\\index.js";
const parsed = pathModule.parse(rootURL);
console.log(parsed); // {root: 'D:\\',dir: 'D:\\datalandcouses\\nodejsbatch1l7pathmodule',base: 'index.js',ext: '.js',name: 'index'}

console.log(parsed.root);
console.log(parsed.dir);
console.log(parsed.base);
console.log(parsed.ext);
console.log(parsed.name);

// Format()
const formatted = pathModule.format({
    dir: "/users/projects",
    base: "app.js"
});

console.log(formatted); // /users/projects\app.js

// => join()
const fullpath = pathModule.join("/folder1","folder2","folder3","project","app.js");
console.log(fullpath); // \folder1\folder2\folder3\project\app.js

// => resolve()
const resolvepath = pathModule.resolve("projects","libs","js","app.js");
console.log(resolvepath); // D:\datalandcouses\nodejsbatch1\l7pathmodule\projects\libs\js\app.js


// => normalize()
const messypath = "/users/app/../app/project//app.js";
console.log(pathModule.normalize(messypath)); // \users\app\project\app.js

// => relative(from, to)
const from = "/users/app/project"
const to = "/users/app/assets/image";
console.log(pathModule.relative(from,to)) // ..\assets\image

// encodeURIComponent()
function encodeurl(filepath){
    const arrparths = filepath.split(pathModule.sep);

    return arrparths.map(arrparths => encodeURIComponent(arrparths)).join("/")
}

const pathone = pathModule.join("assets","my project","new app.js");
console.log(pathone); //assets\my project\new app.js
console.log(encodeurl(pathone)); // assets/my%20project/new%20app.js

// => decodeURIComponent
function decodeurl(filepath){
    const arrparths = filepath.split("/");
    return arrparths.map(arrparth => decodeURIComponent(arrparth)).join(pathModule.sep);
}


const pathtwo = "assets/my%20project/new%20app.js"
console.log(decodeurl(pathtwo)); // assets\my project\new app.js


// exe (create folder with fs module including path module)
const path = require("path");
const fs = require('fs');

const dirpath = path.join(__dirname,"projectfolder");
if(!fs.existsSync(dirpath)){
    fs.mkdirSync(dirpath);
    console.log("Create Folder Successfully",dirpath); // Create Folder Successfully D:\datalandcouses\nodejsbatch1\l7pathmodule\projectfolder
 
}




// .dirname(absolute file path) 
// .basename(absolute file path)
// .basename(absolute file path,"file extension")
// .extname(absolute file path)
// .split(url)
// .parse(url)
// .format({})
// .join()
// .resolve()
// .normalize()
// .relative(from.to)
// .encodeURIComponent()
// .decodeURIComponent()

