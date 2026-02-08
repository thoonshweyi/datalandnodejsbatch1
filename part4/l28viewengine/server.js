// Build in middleware

import express from "express";

import { fileURLToPath } from "url";
import path from "path";

const app = express()
const port = 3000

// Register view engine, SET EJS as view engine 
app.set("view engine","ejs") 


// Set views folder 
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// console.log(__dirname) // D:\datalandcouses\nodejsbatch1\part4\l27viewengine

app.set("views",path.join(__dirname,"views"));

// Get route
app.get('/', (req, res) => {
    res.render("index");
})


app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`)
})

// nodemon server.js  