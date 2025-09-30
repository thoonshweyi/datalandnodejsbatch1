// => Useful OS Methods

const os = require("os");

// User & Host Info 
console.log("Home Directory: ", os.homedir()) // home/admimistrator  //Home Directory:  C:\Users\Thoon Shwe Yi Kyaw
console.log("Current user info: ", os.userInfo()) // 
console.log("Current user info username: ", os.userInfo().username) // Current user info:  Thoon Shwe Yi Kyaw
console.log("Current user info homedir: ", os.userInfo().homedir) // Current user info:  C:\Users\Thoon Shwe Yi Kyaw
console.log("The system hostname: ", os.hostname()) // The system hostname:  ThornPC

// System Info 
console.log("OS Platform: ",os.platform()); // linux // win32
console.log("OS Type: ",os.type());
console.log("CPU architecture ",os.arch()); // CPU architecture  x64

// CPU and Memery Info
console.log("An array of CPU cores info: ",os.cpus()[0].model) // 13th Gen Intel(R) Core(TM) i5-13500H
console.log("Total system memory in bytes: ",os.totalmem()) // 16794767360 (16 Gb)
console.log("Free system memory in bytes: ",os.freemem()) // 

// Network Info
console.log("Network Interfaces: ",os.networkInterfaces())
// console.log("Network Interfaces: ",os.networkInterfaces().eno1[0].address)

// System Uptime
console.log("System uptime in seconds: ",os.uptime()); // 