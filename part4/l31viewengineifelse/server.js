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

// => Passing Variable to EJS
app.get('/profile', (req, res) => {
    const user = {
      name : "Aung Kyaw Kyaw",
      age: 25,
      city: "Mandalay"
    }

    res.render("profile",{user});
})

// => Looping
app.get('/students', (req, res) => {
    const students = [
      {id:1,name:"Aung Aung",age:20,score:85},
      {id:2,name:"Su Su",age:19,score:92},
      {id:3,name:"Nyi Nyi",age:17,score:39},
      {id:4,name:"Yoon Yoon",age:18,score:40},
    ];

    res.render("students",{students});
})

app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`)
})

// nodemon server.js  

// <%= %> = output value
// <% %> = no putput value(logic only)

// output =
// Logic code doesn't use =