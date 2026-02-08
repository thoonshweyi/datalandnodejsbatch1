const express = require('express')
const app = express()
const port = 3000

// home route
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



// Route parameter
app.get('/users/:userid', (req, res) => {
    res.send(`User ID: ${req.params.userid}`);
})


// Route multiple parameters (http://localhost:3000/users/10/books/1001)
app.get('/users/:userid/books/:bookid', (req, res) => {
    res.send(`User ID: ${req.params.userid}, Book ID: ${req.params.bookid}`);
})

// Query parameters (http://localhost:3000/search/?title=postone, )
app.get('/search', (req, res) => {
    const query = req.query.title;
    const page = req.query.page || 1; 
    res.send(`Search for: ${query}, Page: ${page}`);
})


// Single Callback
app.get("/mycall/a",(req,res)=>{
  res.send("Hello I am A!");
})


// Multi Callback
app.get("/mycall/b",(req,res,next)=>{
  console.log("First callback");
  next();
},(req,res)=>{
  res.send("Hello I am B!")
})

// Array Callback
const callback1 = (req,res,next)=>{
  console.log("Callback 1 is working.")
  next();
}
const callback2 = (req,res,next)=>{
  console.log("Callback 2 is working.")
  next();
}
const callback3 = (req,res,next)=>{
  console.log("Callback 3 is working.")
  next();
}
const callback4 = (req,res,next)=>{
  console.log("Callback 4 is working.")
  next();
}

const callback5 = (req,res)=>{
  res.send("Hello I am C")
}


app.get("/mycall/c",[callback1,callback2,callback3,callback4,callback5])


app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`)
})
