// Build in middleware

const express = require('express')
const app = express()
const port = 3000

// useful for POST/PUT
app.use(express.json());



// Custom middleware function 
const requestLogger = (req,res,next)=>{
  console.log(`${new Date().toISOString()} - ${req.method} , ${req.path} ${req.originalUrl}`)
  next();
}
app.use(requestLogger)

// admin route
app.use('/admin', (req, res,next) => {
    console.log("Admin area");
    next();
})

// app.get('/admin/dashboard', (req, res) => {
//     res.send('Admin dashboard area');
// })

// Get route
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


app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`)
})
// ---------------------------------------------------------------------------------------
// 💡 What is Express Middleware?

// In Express.js, middleware is a function that sits between the request (client) and the response (server) — it can inspect, modify, or handle the request and response objects before passing control to the next middleware or route handler.

// Think of it like a pipeline — every incoming request goes through a series of middleware functions, one after another.

// 🧩 Middleware Function Structure

// A middleware function typically looks like this:

// function middleware(req, res, next) {
//   // Do something with req or res
//   next(); // Pass control to the next middleware
// }


// req → the request object (data coming from the client)

// res → the response object (used to send data back)

// next → a callback function that tells Express to move on to the next middleware or route

// If you don’t call next(), the request will stop there — Express will never move on, and the client will hang.





// ⚙️ 1. What happens when you call app.use()

// When you write:

// app.use(requestLogger);


// you are telling Express:

// “Hey, whenever a request comes in, please add requestLogger to the list of middleware that should run.”

// So, app.use() doesn’t immediately execute your middleware.
// It simply registers it in an internal list (array) that Express keeps.

// You can think of it like this:

// app._router.stack.push(requestLogger);


// (Internally, Express uses an internal router and stores all middleware in app._router.stack.)

// 🧩 2. Express Middleware Stack

// Express maintains a stack (array) of layers.
// Each layer can be:

// a middleware function (like requestLogger)

// or a route handler (like app.get('/users', ...))

// Example (conceptually):

// [
//   { path: '/', handle: express.json },
//   { path: '/', handle: requestLogger },
//   { path: '/users', handle: getUsersRoute }
// ]


// So, when you call app.use():

// Express wraps your function (requestLogger) into an object.

// That object is pushed into this internal stack.

// ⚡ 3. When a request arrives

// When a request hits your server (e.g. GET /users):

// Express looks at its internal middleware stack.

// It starts from the top of the stack.

// For each layer:

// If the path matches (or is / for global middleware),

// It calls the middleware function:

// middleware(req, res, next)


// If that function calls next(), Express moves to the next layer in the stack.

// This continues until:

// A route handler sends a response, or

// No middleware matches (then Express sends a default 404).





// 🧩 1. Basic Concept

// When you write:

// app.use('/users', authMiddleware);


// you are saying:

// “For any route that starts with /users, run authMiddleware first.”

// So Express stores that middleware with the base path /users.
// Then when a request like /users/123 comes in, Express checks:

// Does the path start with /users?

// ✅ Yes → Run authMiddleware.