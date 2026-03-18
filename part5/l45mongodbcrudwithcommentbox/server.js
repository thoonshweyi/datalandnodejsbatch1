import 'dotenv/config' // load .env
import express from "express";
import { fileURLToPath } from "url";
import path from "path";
import morgan from "morgan";
import {MongoClient, ObjectId} from "mongodb"
import {Server} from "socket.io";
import multer from "multer"
import fs from "fs"

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

// My Family @ Photo 2026!!.jpg to 1773330136527-my-family-photo-2026.jpg

//=> Upload Image
const uploadDir = path.join(__dirname,"public","uploads");
if(!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir,{recursive:true}); // false(default) Only create ONE folter level, true Create parent folders automatically

const storage = multer.diskStorage({
	destination: (req, file, cb) => cb(null, uploadDir),
	filename: function (req, file, cb) {
		const ext = path.extname(file.originalname).toLowerCase(); //photo.JPG to .jpg
		const uniquename = file.originalname // family @ photo 2026!!.JPG 
								.replace(ext,"") // Remove .jpg
								.toLowerCase() // my family @ photo 2026!!
								.replace(/[^\w\s-]/g,"") // Remove Special Character, my family photo 2026, [^w] letters,+numbers+underscore , \s space
								.replace(/[\s_-]/g,"-") // my-family-photo-2026
								.replace(/^-+|-+$/g,""); // trim leading and ending dashes, my-family-photo-2026, /g remove all matches, "hello!!!", replace("!","") => "hello!!", "hello!!!".replace(/!/g,"") = "hello"
		
		const uniqueSuffix = `${Date.now()}-${uniquename}${ext}`;
		cb(null, uniqueSuffix);
  	}
})

// allow only image file
function fileFilter (req, file, cb) {
	console.log(file.mimetype); // image/png, image/jpeg

	if(!file.mimetype.startsWith('image/')){
		// return cb(null,false);
		return  cb(new Error('Only image files are allowed'),false);
	}

	cb(null, true)

}

const upload = multer({
	storage,
	fileFilter: fileFilter,
	limits: {
		fileSize: 2 * 1024 * 1024  // 2MB // 1KB 1024 bytes, 1MB = 1024 x 1024 bytes, 2 (MB) = 2 x 1024 (KB per MB) x 1024 (bytes per KB) = 3,145,728
	}
})


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

app.post('/posts/create', upload.single('image'), async (req,res)=>{
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

		// multer file info
		const imageURL = req.file ? `/uploads/${req.file.filename}` : null;

		// prepare post data
		const newPost = {
			title: title.trim(),
			slug,
			subtitle: subtitle.trim(),
			body: body.trim(),
			imageURL,
			createdAt: new Date()
		}

		const result = await db.collection('posts').insertOne(newPost);
		console.log("Post created with ID",result.insertedId);

		// Socket.IO 
		req.io.emit('posts:created',{
			title: newPost.title,
			slug: newPost.slug,
			imageURL: newPost.imageURL,
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

// Start Single Post Detail Page (by id)
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
// End Single Post Detail Page (by id)

// Start Single Post Detail Page (by slug)
app.get("/posts/:slug",async(req,res)=>{
	try{
		const {slug} = req.params;

		const post = await req.db.collection('posts').findOne({slug});

		if(!post){
			return res.status(404).render("404",{title: "404"});
		}

		const comments = await req.db.collection('comments').find({postId: post._id}).sort({createdAt: -1}).toArray();

		return res.render('details',{
			title: post.title,
			post,
			comments,
			commentError: null
		})
	}catch(error){
		console.error("Error fetching single post: ",error);
		res.status(500).render("error",{
			title: "Server Error",
			error: "Failed to load post details"
		})
	}
});
// End Single Post Detail Page (by slug)

// Comment Start
app.post("/posts/:slug/comments",async(req,res)=>{

	try{
		const {slug} = req.params;
		const {name, message} = req.body;
		const post = await req.db.collection('posts').findOne({slug});

		if(!post){
			return res.status(404).render("404",{title: "404"});
		}

		if(!name || !message){
			const comments =   await req.db.collection('comments')
				.find({postId: post._id})
				.sort({createdAt: -1})
				.toArray();

			return res.render('details',{
				title: post.title,
				post,
				comments,
				commentError: "Name and comment are required"
			})
		}

		const newcomment = {
			postId: post._id,
			name: name.trim(),
			message: message.trim(),
			createdAt: new Date()
		}

		await req.db.collection('comments').insertOne(newcomment);

		// Real-time: send to people who are on this single post
		req.io.to(`post:${slug}`).emit('comments:created',{
			slug,
			comment:{
				name: newcomment.name,
				message: newcomment.message,
				createdAt: newcomment.createdAt
			}

		})

		return res.redirect(`/posts/${slug}`)
	}catch(error){
		console.error("Error fetching single post: ",error);
		res.status(500).render("error",{
			title: "Server Error",
			error: `Failed to create comment: ${err.message}`
		})
	}
});
// Comment End

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



app.post("/posts/:id/edit", upload.single('image'),async(req,res)=>{
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

		// image logic
		let imageURL = existing.imageURL || null;

		if(req.file){
			imageURL = `/uploads/${req.file.filename}`;

			// delete old file
			if(existing.imageURL){
				// existing.imageURL = `/uploads/1773590516998-adorable-puppy-sitting-on-green-grass-photo.jpg`
				// const oldpath = path.join(__dirname,"public",existing.imageURL); // **** "l44mongodbcrudwithimage/public//uploads/1773590516998-adorable-puppy-sitting-on-green-grass-photo.jpg"
				
				// remove extra /
				const oldpathsafe = path.join(__dirname,"public",existing.imageURL).replace( /^\/+/ ,""); // // **** "l44mongodbcrudwithimage/public//uploads/1773590516998-adorable-puppy-sitting-on-green-grass-photo.jpg"
				fs.unlink(oldpathsafe,(err)=>{
					if (err) console.log("OLd image delete error:",err.message);
				})
			}
		}	

		const updateData = {
			title: title.trim(),
			subtitle: subtitle.trim(),
			slug: setnewslug,
			body: body.trim(),
			imageURL,
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
			imageURL: updateData.imageURL,
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
// -----------------------------------------------------------------------------------
// 1. A Callback Is Passed as an Argument

// A callback function is given to another function as a parameter.

// Example:

// function processData(data, callback){
//     console.log("Processing:", data);
//     callback();
// }

// function done(){
//     console.log("Finished");
// }

// processData("file", done);

// Here:

// done → callback function

// The main function receives the callback and can run it later.

// 2. A Callback Is Executed by Another Function

// The callback is not executed where it is defined.
// It is executed inside the function that receives it.

// Example:

// function task(cb){
//     console.log("Task running...");
//     cb();
// }

// task(function(){
//     console.log("Callback executed");
// });

// Execution order:

// Task running...
// Callback executed

// So the control of execution belongs to the receiving function.

// 3. Execution Happens Later (Deferred Execution)

// Callbacks are usually executed after some operation finishes.

// Common cases:

// File reading

// HTTP requests

// Database queries

// File uploads

// Example:

// setTimeout(function(){
//     console.log("Callback after 2 seconds");
// }, 2000);

// The callback runs later, not immediately.

// 4. Enables Asynchronous Programming

// Callbacks allow programs to continue running while waiting for something.

// Without callback (blocking):

// Wait → finish → continue

// With callback (non-blocking):

// Start task → continue program → callback runs when done

// This is why Node.js relies heavily on callbacks.

// 5. Often Follows the Error-First Pattern

// In Node.js the common pattern is:

// callback(error, result)

// Meaning:

// callback(null, result) → success
// callback(error) → failure

// Example:

// function calculate(a,b,cb){
//     if(b === 0){
//         cb("Division error");
//     }else{
//         cb(null, a/b);
//     }
// }
// 6. Can Be Anonymous or Named

// Callbacks can be defined inline or as a separate function.

// Anonymous callback
// setTimeout(function(){
//     console.log("Hello");
// },1000);
// Named callback
// function sayHello(){
//     console.log("Hello");
// }

// setTimeout(sayHello,1000);
// 7. Can Be Synchronous or Asynchronous

// Callbacks may run immediately or later.

// Synchronous callback:

// [1,2,3].forEach(function(n){
//     console.log(n);
// });

// Asynchronous callback:

// setTimeout(function(){
//     console.log("Later");
// },1000);
// 8. Used to Return Results from Async Operations

// When a function cannot return a value immediately, it uses a callback.

// Example:

// function getData(cb){
//     setTimeout(function(){
//         cb("data loaded");
//     },1000);
// }

// getData(function(result){
//     console.log(result);
// });
// 9. Used to Control Program Flow

// Callbacks let you decide what should happen after something finishes.

// Example:

// uploadFile(file, function(){
//     saveRecord();
// });

// So the callback defines the next step.

// How This Applies to Multer

// In Multer storage configuration:

// destination: (req, file, cb) => cb(null, uploadDir)

// Here:

// cb → callback function

// You call:

// cb(null, uploadDir)

// to tell Multer:

// Upload succeeded
// Use uploadDir as destination

// ✅ Summary – Main Characteristics of Callback Functions

// Passed as an argument to another function

// Executed by the receiving function

// Often executed later (deferred)

// Enables asynchronous programming

// Usually follows callback(error, result) pattern

// Can be anonymous or named

// May be synchronous or asynchronous

// Used to return results of async tasks

// Controls the next step in program flow

// -------------------
// 1 KB = 1024 bytes
// 1 MB = 1024 KB 

// => Multer Midleware
// app.post("/posts/:id/edit", upload.single('image'), async (req, res) => {

// app.post() accepts multiple middleware functions. The structure is:

// app.post(path, middleware1, middleware2, middleware3, handler)

// So here:

// 1️⃣ First parameter

// "/posts/:id/edit"

// → The route path

// 2️⃣ Second parameter

// upload.single('image')

// → A middleware function from multer

// 3️⃣ Third parameter

// async (req, res) => {}

// → The route handler (controller)

// What upload.single('image') actually is

// upload comes from:

// const multer = require('multer');
// const upload = multer({ storage });

// When you call:

// upload.single('image')

// Multer returns a middleware function.

// So Express really receives something like this:

// app.post(
//   "/posts/:id/edit",
//   function multerMiddleware(req, res, next) { ... },
//   async function handler(req, res) { ... }
// )
// What this middleware does

// upload.single('image') will:

// Read the multipart/form-data request

// Find the field named image

// Save the file using your multer.diskStorage

// Attach file info to:

// req.file

// Example result:

// req.file = {
//   fieldname: 'image',
//   originalname: 'photo.jpg',
//   filename: 'abc123.jpg',
//   path: 'uploads/abc123.jpg',
//   size: 24567
// }
// Execution Flow

// When a request arrives:

// Client
//    │
//    ▼
// upload.single('image')   ← multer middleware runs first
//    │
//    ▼
// async (req,res)=>{}      ← your route code runs after upload