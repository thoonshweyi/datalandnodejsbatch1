// Build in middleware

import express from "express";

import { fileURLToPath } from "url";
import path from "path";
import morgan from "morgan";
import {MongoClient} from "mongodb"

// express app
const app = express()
const port = 3000

// Set views folder 
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// console.log(__dirname) // D:\datalandcouses\nodejsbatch1\part4\l27viewengine

// Register view engine, SET EJS as view engine 
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"));


// middleware and static files
app.use(morgan("dev"));
app.use(express.static('public')); // http://localhost:3000/style.css
app.use(express.urlencoded({extended:true})) // ***** HTML FORM submit for post/put 
app.use(express.json()); // for JSON requests (from API Data)


// MongoDB Atlas URI
const cluster = "cluster0";
const dbName = "nodejsbatch2";
const dbUser = "superuser";
const dbPass = "Admin123";
const dbURL = `mongodb+srv://${dbUser}:${dbPass}@${cluster}.5yebdvl.mongodb.net/?appName=Cluster0`;

// MongoDB client

let client;
let db;

// Connect to MongoDB
async function connectToMongoDB(){
	try{
		client = new MongoClient(dbURL);
		await client.connect();

		db = client.db(dbName);
		console.log("Conected to mongodb.");

		app.listen(port, () => {
			console.log(`Example app listening on http://localhost:${port}`)
		})

	}catch(err){
		console.error("MongoDB connection error ",err);
		process.exit(1);
	}
}
connectToMongoDB()


// Database Middleware
app.use((req,res,next)=>{
	if(!db){
		return res.status(503).send("Database is not connected. Pleasee try again later");
	}

	next();
})



// Get route
app.get('/', (req, res) => {
	//  res.render("index")

	// res.render("index",{title:"Home Page"});
	const posts = [
		{ title: "post one", subtitle: "this is new post one", body: "Lorem Ipsum is simply dummy text of the printing and typesetting industry." },
		{ title: "post two", subtitle: "this is new post two", body: "Lorem Ipsum is simply dummy text of the printing and typesetting industry." },
		{ title: "post three", subtitle: "this is new post three", body: "Lorem Ipsum is simply dummy text of the printing and typesetting industry." }
	]
	res.render("index", { title: "Home Page", posts });

})

app.get('/about', (req, res) => {
	res.render("about", { title: "About Page" });
})

app.get('/about-us', (req, res) => {
	res.redirect("/about");
})


app.get('/posts/create', (req, res) => {
	res.render("create", { 
		title: "Create Page",
		error: null,
		formData: null
	});
})

app.post('/posts/create', async (req,res)=>{
	try{
		const {title,subtitle,body} = req.body;
		console.log(title,subtitle,body)

		// validation
		if(!title || !subtitle || !body){
			return res.render("create", { 
				title: "Create Page",
				error: `All fields are required`,
				formData: req.body
			});
		}

		// prepare post data
		const newPost = {
			title: title.trim(),
			subtitle: subtitle.trim(),
			body: body.trim(),
			createdAt: new Date()
		}

		const result = await db.collection('posts').insertOne(newPost);
		console.log("Post created with ID",result.insertedId);

		// show success message 
		return res.render("success", { 
			title: "Success",
			message: `Post created successfully`,
			postId: result.insertedId
		});
	}catch(error){
		console.error("Error creating post: ",error);
		res.render("create", { 
			title: "Create Page",
			error: `Failed to create post: ${error.message}`,
			formData: req.body
		});
	}
})

// 404 (note : that must be bottom line) **
app.use((req, res) => {
	res.status(404).render("404", { title: '404' })
})



// Shutdown		( SIGINT = Signal Intterupt, raised when you press ctrl+c , woking with terminal )
process.on("SIGINT",async ()=>{
	await client.close();
	console.log("MongoDB connection closed through app termination");
	process.exit(0);
});


// nodemon server.js

// <%= %> = output value
// <% %> = no putput value(logic only)

// output =
// Logic code doesn't use =


// app.use(express.urlencoded({extended:true})) // for parsing application/x-www-form-urlencoded
// html -> form ( default = URL encoded format ) -> server  (need to decode)

// eg . form = name=su%su&age=20&city="yangon"
// eg. server = username=su su, city=yangon

// before middleware
// app.post("/createuser",(req,res)=>{
// 	console.log(req.body); 	// undefined
// })


// after middleware
// app.post("/createuser",(req,res)=>{
// 	console.log(req.body); // {name: "su su",age:20}

// 	const name = req.body.name;
// 	const age = req.body.age;
// })

// => extended: true
		// nexted objects or array support

		// after parse
		// {
		// 	user:{
		// 		name: "su su",
		// 		age:20,
		// 	},
		// 	hobbies:['readomg','coding']
		// }

// => extended: false
		// key value pair
		// no nested objects

// ✅ What this does (short version)

// 👉 It allows your Express app to read form data sent from HTML forms
// (application/x-www-form-urlencoded).

// Without this line, req.body will be empty when a form is submitted.

// 🔍 Break it down
// 1️⃣ express.urlencoded()

// This is a built-in Express middleware

// It parses URL-encoded data

// Commonly used for HTML form submissions








// 2️⃣ What does NOT finish without return?

// ❌ Your JavaScript function keeps running

// Express does not automatically stop execution.

// So:

// res.render(...)
// console.log("still running"); // ← this WILL run
// res.redirect(...)             // ← 💥 error

// 3️⃣ Timeline (this clears everything)
// POST /posts/create
// │
// ├─ res.render()   → HTTP response finished ✅
// │
// ├─ JS function continues ❌
// │
// ├─ res.redirect() → tries second response ❌
// │
// └─ Node throws error 💥


// --------------------------------------------------------------
// 1️⃣ res.send()
// What it does

// Sends anything (string, HTML, number, object, buffer).

// Express decides the Content-Type automatically.

// Example
// res.send('Hello World');

// res.send('<h1>Hello</h1>');

// res.send({ name: 'John' });

// Browser receives

// Text / HTML / JSON (auto-detected)

// When to use

// ✔ Simple responses
// ✔ Quick testing
// ✔ Small APIs (but usually res.json is better)

// 2️⃣ res.json()
// What it does

// Sends JSON only

// Automatically converts object → JSON

// Sets Content-Type: application/json

// Example
// res.json({ success: true, id: 5 });

// Browser receives
// {
//   "success": true,
//   "id": 5
// }

// When to use

// ✔ APIs
// ✔ AJAX / Fetch / Axios responses
// ✔ Frontend-backend communication

// 💡 res.json() is basically:

// res.send(JSON.stringify(obj))


// (but safer & cleaner)

// 3️⃣ res.render()
// What it does

// Uses a template engine (EJS, Pug, Handlebars)

// Converts template → HTML

// Sends HTML to browser

// Example (EJS)
// res.render('posts/create', {
//   error: 'Title is required'
// });

// What happens internally

// EJS file is processed

// HTML is generated

// HTML is sent to browser

// When to use

// ✔ Server-side rendered pages
// ✔ Forms with validation errors
// ✔ Traditional MVC apps

// 4️⃣ res.sendFile()
// What it does

// Sends a physical file from disk.

// No template processing.

// Example
// res.sendFile(__dirname + '/public/index.html');

// When to use

// ✔ Static HTML pages
// ✔ Downloads
// ✔ PDFs, images, reports

// ⚠️ Must use absolute path

// 🧠 Comparison Table (easy to remember)
// Method	Sends	Typical Use
// res.send()	Anything	Simple response
// res.json()	JSON	API / AJAX
// res.render()	HTML (from template)	Server-side views
// res.sendFile()	File	Static files / downloads
// 🚨 Very Important Rule (again 😄)
// res.send()
// res.render()
// res.json()
// res.sendFile()










// 1️⃣ What problem does render() solve?

// Imagine you want to send this HTML:

// <h1>Hello John</h1>
// <p>Today is 2026-01-14</p>


// But John and date change every request.

// You have two choices:

// ❌ Option A – Hardcode HTML in JS (bad)
// res.send(`<h1>Hello ${name}</h1>`);


// Messy, hard to maintain.

// ✅ Option B – Use a template file (GOOD)

// You write an HTML file with placeholders.

// That’s what res.render() is for.

// 2️⃣ What actually is “rendering”?

// Rendering = fill data into a template and produce HTML

// Think like:

// Template + Data → Final HTML

// 3️⃣ Simple EJS example (step-by-step)
// 📄 views/hello.ejs
// <h1>Hello <%= name %></h1>
// <p>Age: <%= age %></p>


// This file is NOT HTML yet
// It contains variables.

// 📄 Route
// app.get('/hello', (req, res) => {
//     res.render('hello', {
//         name: 'John',
//         age: 25
//     });
// });

// 🔄 What Express does internally

// Finds views/hello.ejs

// Replaces <%= name %> → John

// Replaces <%= age %> → 25

// Produces pure HTML

// Sends HTML to browser

// Final HTML sent:

// <h1>Hello John</h1>
// <p>Age: 25</p>


// 👉 That’s render

// 4️⃣ Does render() work without EJS?

// ❌ No template engine → ❌ res.render() won’t work

// You MUST install & configure one engine.