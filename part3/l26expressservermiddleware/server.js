// Build in middleware

import express from "express"
import morgan from "morgan"
const app = express()
const port = 3000

// useful for POST/PUT
app.use(express.json());



// Thirdparty middlewares




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
