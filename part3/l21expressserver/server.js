const express = require('express')
const app = express()
const port = 3000

// home route
app.get('/', (req, res) => {
    res.sendFile("./views/index.html",{root:__dirname});
})

app.get('/about', (req, res) => {
  res.sendFile("./views/about.html",{root:__dirname});
})

// redirect route to about page
app.get('/about-us', (req, res) => {
  res.redirect("about");
})


// 404 handler
app.use((req, res) => {
   res.sendFile("./views/404.html",{root:__dirname});
})

app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`)
})


// nodemon server.js
// 13ES