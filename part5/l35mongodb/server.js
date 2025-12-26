// Build in middleware

import express from "express";

import { fileURLToPath } from "url";
import path from "path";
import morgan from "morgan";

import mongoose from "mongoose"

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
app.use(express.json()); // for JSON requests


// MongoDB Atlas URI
const cluster = "cluster0";
const dbName = "nodejsbatch2";
const dbUser = "superuser";
const dbPass = "Admin123";
const dbuURL = `mongodb+srv://${dbUser}:${dbPass}@${cluster}.5yebdvl.mongodb.net/?appName=Cluster0`;

mongoose.connect(dbuURL)
	.then(() => {
		console.log("Conected to mongodb.");
		app.listen(port, () => {
			console.log(`Example app listening on http://localhost:${port}`)
		})

	})
	.catch(err => console.log(err));















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
	res.render("create", { title: "Create Page" });
})

// 404 (note : that must be bottom line) **
app.use((req, res) => {
	res.status(404).render("404", { title: '404' })
})


// nodemon server.js

// <%= %> = output value
// <% %> = no putput value(logic only)

// output =
// Logic code doesn't use =