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
  //  res.render("index")

    // res.render("index",{title:"Home Page"});


  const posts = [
    {title: "post one",subtitle:"this is new post one",body:"Lorem Ipsum is simply dummy text of the printing and typesetting industry."},
    {title: "post two",subtitle:"this is new post two",body:"Lorem Ipsum is simply dummy text of the printing and typesetting industry."},
    {title: "post three",subtitle:"this is new post three",body:"Lorem Ipsum is simply dummy text of the printing and typesetting industry."}
  ]
  res.render("index",{title:"Home Page",posts});

})

app.get('/about', (req, res) => {
    res.render("about",{title:"About Page"});
})

app.get('/about-us', (req, res) => {
    res.redirect("/about");
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

app.get('/posts/create', (req, res) => {
    res.render("create",{title:"Create Page"});
})

// 404 (note : that must be bottom line) **
app.use((req,res)=>{
  res.status(404).render("404",{title:'404'})
})

app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`)
})

// nodemon server.js  

// <%= %> = output value
// <% %> = no putput value(logic only)

// output =
// Logic code doesn't use =