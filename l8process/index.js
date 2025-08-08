// => process
console.log("OS Platform",process.platform); // Linux/ win32
console.log("Node Version: ",process.version); // Node Version:  v24.3.0
console.log("Versions: ",process.versions); // versions obj
console.log("Architecture: ",process.arch); // Architecture:  x64
console.log("Current working directory: ",process.cwd()); // Current working directory:  D:\datalandcouses\nodejsbatch1\l8process
console.log("Command Line Arguments: ",process.argv); //
console.log(`Process has been running for ${process.uptime()} seconds.: `); //Process has been running for 0.0408402 seconds.:


console.log(process.argv);
const argname = process.argv[2];
const argage = process.argv[3];
console.log(argname,argage); // SuSu 25



// *result (process.platform)
// linus 
// darwin
// win32

// *result (versions)
// Node Version:  {
//   node: '24.3.0',
//   acorn: '8.15.0',
//   ada: '3.2.4',
//   amaro: '1.1.0',
//   ares: '1.34.5',
//   brotli: '1.1.0',
//   cjs_module_lexer: '2.1.0',
//   cldr: '47.0',
//   icu: '77.1',
//   llhttp: '9.3.0',
//   modules: '137',
//   napi: '10',
//   nbytes: '0.1.1',
//   ncrypto: '0.0.1',
//   nghttp2: '1.66.0',
//   openssl: '3.0.16',
//   simdjson: '3.13.0',
//   simdutf: '6.4.0',
//   sqlite: '3.50.1',
//   tz: '2025b',
//   undici: '7.10.0',
//   unicode: '16.0',
//   uv: '1.51.0',
//   uvwasi: '0.0.21',
//   v8: '13.6.233.10-node.18',
//   zlib: '1.3.1-470d3a2',
//   zstd: '1.5.7'
// }


// Command Line Arguments:  [
//   'C:\\Program Files\\nodejs\\node.exe',
//   'D:\\datalandcouses\\nodejsbatch1\\l8process\\index.js'
// ]