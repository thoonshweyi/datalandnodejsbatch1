// Global Variable

console.log("Dir Name = ",__dirname); // Dir Name =  D:\datalandcouses\nodejsbatch1
console.log("File Name = ",__filename); // File Name =  D:\datalandcouses\nodejsbatch1\l2globalvariables.js

const fullname = "Aung Ko Ko";
console.log(fullname);

// => global
global.nickname = "Aung Aung";
console.log(nickname);

// => process
console.log("Node Version: ",process.version) // Node Version:  v24.3.0
console.log("OS Platform",process.platform) // Linux/ win32



// node l2globalvariables.js