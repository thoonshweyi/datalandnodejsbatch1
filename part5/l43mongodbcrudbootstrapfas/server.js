import 'dotenv/config' // load .env
import express from "express";
import { fileURLToPath } from "url";
import path from "path";
import morgan from "morgan";
import {MongoClient, ObjectId} from "mongodb"
import {Server} from "socket.io";

// express app
const app = express()
const port = process.env.PORT || 5000;

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

// Serve Bootstrap files
app.use("/bootstrap",express.static(path.join(__dirname,"node_modules/bootstrap/dist/")));

// Serve Font Awesome files
app.use("/fontawesome",express.static(path.join(__dirname,"node_modules/@fortawesome/fontawesome-free")));

// Serve SWEETALERT2
app.use("/sweetalert2",express.static(path.join(__dirname,"node_modules/sweetalert2/dist")))

// Serve Toastify
app.use("/toastify",express.static(path.join(__dirname,"node_modules/toastify-js/src")))

// Start server
const expressServer = app.listen(port,()=>{
	console.log(`Server listening on http://localhost:${port}`);
});

// Socket.IO attached to server
const io = new Server(expressServer,{
	cors:{
		origin: "*", // for dev. In production set your domain
		methods: ["GET","POST"]
	}
});

// Sockeet events
io.on("connection",(socket)=>{
	console.log("Socket connected: ",socket.id);

	socket.on("disconnect",()=>{
		console.log("Socket disconnect: ",socket.id)
	});
});

// MongoDB Atlas URI
const dbName = process.env.DB_NAME;
const dbURL = process.env.MONGO_URI || "mongodb://127.0.0.1:27017";

// MongoDB client

let client;
let db;

// Helpers
function slugify(title){
	return 	String(title)
			.trim()
			.toLowerCase()
			.replace(/[^\w\s-]/g,'') // remove special chars
			.replace(/[\s_-]/g,"-") // spaces / underscores to dash
			.replace(/^-+|-+$/g,""); // trim (left or right)
}

// [^] = not, remove @#$!

// \w = word character (a-zstdCompress,A-Z,0-9,_)
// \s = white space

// g = global
// const text = "cat cow cat"
// text.replace(/cat/,'dog') // dog cow cat
// text.replace(/cat/g,'dog') // dog cow dog

// New Post One = new_post-one
// New Post One = new_post-one

async function uniqueslug(collection,baseSlug, ignoreId=null){
	let slug = baseSlug;
	let i = 0;

	while(true){
		const query = ignoreId ? {slug,_id:{$ne:ignoreId}}  : {slug}

		const exists = await collection.findOne(query,{projection:{_id:1}}); // {projection:{_id:1}} means only return the _id field

		if(!exists) return slug;

		i += 1;
		slug = `${baseSlug}-${i}`;
	}
}

// Connect to MongoDB
async function connectToMongoDB(){
	try{
		client = new MongoClient(dbURL);
		await client.connect();

		db = client.db(dbName);
		console.log("Conected to mongodb.");

	}catch(err){
		console.error("MongoDB connection error ",err);
		process.exit(1);
	}
}
connectToMongoDB()


// Database Middleware
app.use((req,res,next)=>{
	if(!db) return res.status(503).send("Database is not connected. Pleasee try again later");

	req.db = db; // just nned for i you want to use req.db.collection()
	req.io = io;

	next();
});



// Get route (with search + pagination)
app.get('/', async(req, res) => {

	try{
		// console.log(req);

		const page = Math.max(parseInt(req.query.page) || 1,1); // NaN ignore
		const limit = 2;
		const skip = (page - 1) * limit;

		// post = 4;
		// page = 2;
		// limit = 2
		// skip = (2-1) * 2 = 2 * 2 = 4

		const q = (req.query.q || "").trim();

		const filter = q ? {
			$or: [
				{title: {$regex:q,$options: "i"}},
				{subtitle: {$regex:q,$options: "i"}},
				{body: {$regex:q,$options: "i"}},
			]
		} : {};

		console.log("Fetching posts from MongoDB....");

		const posts = await db.collection('posts')
						.find(filter)
						.sort({createdAt:-1})
						.skip(skip)
						.limit(limit)
						.toArray(); // Newest first
		// console.log(`Found ${posts.length} posts in database`);

		const total = await db.collection('posts').countDocuments(filter);

		const totalpages = Math.max(Math.ceil(total/limit),1);

		res.render('index',{ 
			title: "Home Page", 
			posts: posts,
			postsCount: posts.length,
			total,
			page,
			totalpages,
			limit,
			q
		});
		
	}catch(error){
		console.error("Error fetching posts from MongoDB.",error)
		
		res.status(500).render('error',{
			title: "Database Error",
			message: "Failed to load posts from database. Please try again later."
		})
	}
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

		const baseslug = slugify(title);

		// optional
		if(!baseslug){
			return res.render("create",{
				title: "Create New Post",
				error: "Title is not valid to generate slug",
				formData: req.body
			});
		}
		const postcol = req.db.collection('posts');
		const slug = await uniqueslug(postcol,baseslug);

		// prepare post data
		const newPost = {
			title: title.trim(),
			slug,
			subtitle: subtitle.trim(),
			body: body.trim(),
			createdAt: new Date()
		}

		const result = await db.collection('posts').insertOne(newPost);
		console.log("Post created with ID",result.insertedId);

		// Socket.IO 
		req.io.emit('posts:created',{
			title: newPost.title,
			slug: newPost.slug,
			createdAt: newPost.createdAt
		});

		// show success message 
		// return res.render("success", { 
		// 	title: "Success",
		// 	message: `Post created successfully`,
		// 	postId: result.insertedId
		// });

		// redirect to single page
		return res.redirect(`/posts/${slug}`);

	}catch(error){
		console.error("Error creating post: ",error);
		res.render("create", { 
			title: "Create Page",
			error: `Failed to create post: ${error.message}`,
			formData: req.body
		});
	}
})

// Single Post Detail Page (by id)
// app.get("/posts/:id",async(req,res)=>{
// 	try{
// 		const {id} = req.params;

// 		if(!ObjectId.isValid(id)){
// 			return res.status(400).render("error",{
// 				title: "Invalid ID",
// 				error: "Post ID is not valid."
// 			});
// 		}

// 		const post = await req.db.collection('posts').findOne({_id: new ObjectId(id)});

// 		if(!post){
// 			return res.status(404).render("404",{title: "404"});
// 		}

// 		return res.render('details',{
// 			title: "Post Details",
// 			post
// 		})
// 	}catch(error){
// 		console.error("Error fetching single post: ",error);
// 		res.status(500).render("error",{
// 			title: "Server Error",
// 			error: ""
// 		})
// 	}
// });

// Single Post Detail Page (by slug)
app.get("/posts/:slug",async(req,res)=>{
	try{
		const {slug} = req.params;

		const post = await req.db.collection('posts').findOne({slug});

		if(!post){
			return res.status(404).render("404",{title: "404"});
		}

		return res.render('details',{
			title: post.title,
			post
		})
	}catch(error){
		console.error("Error fetching single post: ",error);
		res.status(500).render("error",{
			title: "Server Error",
			error: ""
		})
	}
});


// Edit Start
app.get("/posts/:id/edit",async(req,res)=>{
	try{
		const {id} = req.params;

		if(!ObjectId.isValid(id)){
			// THROW ERROR
			return res.status(400).render("error",{
				title: "Invalid ID",
				error: `Post ID is not valid`,
			})
		}

		// const post = await db.collection('posts').findOne({_id: new ObjectId(id)});
		const post = await req.db.collection('posts').findOne({_id: new ObjectId(id)});

		if(!post) return res.status(404).render("404",{title:"404 Not Found"});

		res.render("edit",{
			title: "Edit Post",
			error: null,
			post
		})
	}catch(error){
		console.error("Error edit page",error);
		res.render("error",{
			title: "Server Error",
			error: `Failed to load edit page: ${error.message}`,
		})
	}
})
// Edit End



app.post("/posts/:id/edit",async(req,res)=>{
	try{
		const {id} = req.params;
		const {title,subtitle,body} = req.body
		if(!ObjectId.isValid(id)){
			// THROW ERROR
			return res.status(400).render("error",{
				title: "Invalid ID",
				error: `Post ID is not valid`,
			});
		}

	

		// reload old post to refill form

		// const post = await db.collection('posts').findOne({_id: new ObjectId(id)});
		// const post = await req.db.collection('posts').findOne({_id: new ObjectId(id)});
		
		const postCol = req.db.collection('posts');
		const _id = new ObjectId(id);

		const existing = await postCol.findOne({_id});

		if(!existing) return res.status(404).render("404",{title: "404"});

		if(!title || !subtitle || !body){
			return res.render("edit", { 
				title: "Edit Post",
				error: `All fields are required`,
				post: {
					...existing,
					title,
					subtitle,
					body
				}
			});
		}


		let setnewslug = existing.slug; // post-five to post-six
		const newbaseslug = slugify(title);

		if(newbaseslug && title.trim() !== existing.title){
			setnewslug = await uniqueslug(postCol,newbaseslug,_id);
		}

		const updateData = {
			title: title.trim(),
			subtitle: subtitle.trim(),
			slug: setnewslug,
			body: body.trim(),
			updatedAt: new Date()
		};

		const result = await req.db.collection("posts").updateOne(
			{_id:new ObjectId(id)},
			{$set: updateData}
		);

		if(result.matchedCount === 0){
			return res.status(404).render("404",{title: "404"});
		}

		// Socket.IO 
		req.io.emit('posts:updated',{
			id,
			title: updateData.title,
			slug: setnewslug,
			updatedAt: updateData.updatedAt
		});

		// redirect to home
		// return res.redirect('/');

		return res.redirect(`/posts/${setnewslug}`);
		
	}catch(error){
		console.error("Error uptading page",error);
		res.status(500).render("error",{
			title: "Server Error",
			error: `Failed to update post: ${error.message}`,
		})
	}
})

// Delete Start
app.post("/posts/:id/delete",async(req,res)=>{
	try{
		const {id} = req.params;

		if(!ObjectId.isValid(id)){
			// THROW ERROR
			res.status(400).render("error",{
				title: "Invalid ID",
				error: `Post ID is not valid`,
			})
		}

		// const result = await db.collection('posts').deleteOne({_id: new ObjectId(id)});
		const result = await req.db.collection('posts').deleteOne({_id: new ObjectId(id)});

		if(result.deletedCount === 0){
			return res.status(404).render("404",{title: "404"});
		}

		// Socket.IO 
		req.io.emit('posts:deleted',{id});

		// redirect to home
		return res.redirect('/');
		
	}catch(error){
		console.error("Error deleting post",error);
		res.render("error",{
			title: "Server Error",
			error: `Failed to load delete post: ${error.message}`,
		})
	}
})
// Delete End



// 404 (note : that must be bottom line) **
app.use((req, res) => {
	res.status(404).render("404", { title: '404' })
})



// Shutdown		( SIGINT = Signal Intterupt, raised when you press ctrl+c , woking with terminal )
process.on("SIGINT",async ()=>{

	try{

		if(client) await client.close();
		
		console.log("MongoDB connection closed through app termination");
	}finally{
		process.exit(0);
	}

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


// slug
// Post Three new topic
// post-three-new-topic




// ------------------------------------------------------------------------------------------
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