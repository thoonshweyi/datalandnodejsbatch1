// // => exe 1
// const express = require('express')
// const app = express()
// const port = 3000

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

// app.listen(port, () => {
//   console.log(`Example app listening on http://localhost:${port} .`)
// })


// => exe 2
// const express = require('express')
// const app = express()
// const port = 3000

// app.get('/', (req, res) => {
//   res.send('<p>Index Page</p>')
// })

// app.get('/about', (req, res) => {
//   res.send('<p>About Page</p>')
// })

// app.listen(port, () => {
//   console.log(`Example app listening on http://localhost:${port} .`)
// })

// => exe 3 (http://localhost:3000/,     http://localhost:3000/?name=aungaung)
// const express = require('express')
// const app = express()
// const port = 3000

// app.get('/', (req, res) => {

//     const name = req.query.name || 'Student'

//     res.json({message:`Hello, ${name}`})
// })

// app.get('/about', (req, res) => {
//   res.send('<p>About Page</p>')
// })

// app.listen(port, () => {
//   console.log(`Example app listening on http://localhost:${port} .`)
// })

// => exe 4
const express = require('express')
const app = express()
const port = 3000

// home route
app.get('/', (req, res) => {
    res.send('<h1>Home Page</h1><p>Welcome to our website!</p>')
})

app.get('/about', (req, res) => {
  res.send('<h1>About Us</h1><p>Learn more about our company</p>')
})

// contact route
app.get('/contact', (req, res) => {
  res.send('<h1>Contact Us</h1><p>Get in touch with us.</p>')
})

// route with parameter (http://localhost:3000/user/11)
app.get('/user/:id', (req, res) => {
  res.send(`<h1>User Profile</h1><p>User ID: ${req.params.id}</p>`)
})

// route with multi parameter (http://localhost:3000/products/redbull/110)
app.get('/products/:item/:id', (req, res) => {
    res.json({
        item: req.params.item,
        productid: req.params.id,
        info: `Showing product ${req.params.id} from item ${req.params.item}`
    })
})

// 404 handler
app.use((req, res) => {
   res.status(404).send('<h1>404 - Page ot Found</h1>')
})

app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`)
})


// nodemon server.js