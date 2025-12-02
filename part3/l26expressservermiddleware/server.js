// Build in middleware

import express, { application, text } from "express";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";

import { fileURLToPath } from "url";
import path from "path";

const app = express()
const port = 3000

app.use(morgan('combined')); // dev, combined, short, tiny
app.use(helmet()); // security headers // curl -I http://localhost:3000


// = method 1
// app.use(cors()); // **** allow all origin (development only)

// = method 2
// app.use(cors({
//     origin: "http://localhost:3000",
//     credentials: true
// }))

//= method 3
// if (whitelist.indexOf(origin) !== -1) {
//   callback(null, true)
// } else {
//   callback(new Error('Not allowed by CORS'))
// }

const whitelist = ['http://localhost:8000',"http://frontend.com","http://companyproject.org"];
var corsOptions = {
  origin: function (origin, callback) {
    if(!origin) return callback(null, true) // for thirdparty app (such as postman, curl)
    if (whitelist.indexOf(origin) !== -1) return callback(null, true)
    callback(new Error('Not allowed by CORS'))
  },
  credentials: true
}
app.use(cors(corsOptions));

// useful for POST/PUT
app.use(express.json());




// Get route
app.get('/', (req, res) => {
    res.send('Get request to home page');
})


app.post('/', (req, res) => {
    res.send('POST request to home page');
})

app.put('/user', (req, res) => {
    res.send('PUT request to user');
})

app.delete('/user', (req, res) => {
    res.send('DELETE request to user');
})

app.get("/api/requestinfo",(req,res)=>{
  	const requestInfo = {
    method: req.method, // "GET"
    url: req.url, // /api/requestinfo
    path: req.path, // {}
    query: req.query, // {}
    params: req.params, //
	headers: req.headers, // {....}
	ip: req.ip, // ::1
	hostname: req.hostname, // localhost
	protocol: req.protocol, // localhost
	secure: req.secure // localhost
  }
  res.json(requestInfo);
})

// Setting headers (curl -i http://localhost:3000/api/headers)
app.get("/api/headers",(req,res)=>{
	res.set("Content-Type",'text/plain');

	res.set("X-Custom-Header","Hello i am from Express");
	res.send("Header set");
})


// text/plain = plain text
// text/html = HTML page
// text/css = CSS file
// application/javascript = JS
// application/json = JSON data
// application/pdf = PDF file
// image/png = PNG image

// Query example (http://localhost:3000/api/search?q=nodejs, http://localhost:3000/api/search?q=nodejs&page=2&limit=5)
app.get("/api/search",(req,res)=>{
	console.log(req.query)

	const {q,page=1,limit=10} = req.query;
	if(!q){
		return res.status(400).json({error:"Query parameter is required"});
	}
	res.json({
		query:q,
		curpage: parseInt(page),
		limit: parseInt(limit)
	})
	

})

// console.log(import.meta.url); // file:///D:/datalandcouses/nodejsbatch1/part3/l26expressservermiddleware/server.js
const filepath = fileURLToPath(import.meta.url);
// console.log(filepath); // D:\datalandcouses\nodejsbatch1\part3\l26expressservermiddleware\server.js

const __dirname = path.dirname(filepath);
console.log(__dirname); // D:\datalandcouses\nodejsbatch1\part3\l26expressservermiddleware

app.get("/api/response",(req,res)=>{
	// res.send("Hello Mandalay")

	// res.json({message:"Hello Yanngon"});
	// res.status(200).json({city:"Hello Bago"});

	// res.sendFile("./views/index.html"); // error, path must be absolute
	// res.sendFile("./views/index.html",{root:__dirname}); // error, not common js (__dirname is not defined) - cuz we use 'module'- 'commonjs' ok
	// res.sendFile(path.join(__dirname,"views","index.html"));

	res.redirect("/aboutus");
});

app.get('/aboutus',(req,res)=>{
	res.send("This is About Us Page")
})

app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`)
})

// nodemon server.js  