// Build in middleware

import express from "express";
import morgan from "morgan";
import cors from "cors";

const app = express()
const port = 3000

app.use(morgan('dev')); // dev, combined, short, tiny

// = method 1
// app.use(cors()); // **** allow all origin (development only)

// = method 2
// app.use(cors({
//     origin: "http://localhost:3000",
//     credentials: true
// }))

//= method 3
// if (whitelist.indexOf(origin) !== -1) {
//   callback(null, true)
// } else {
//   callback(new Error('Not allowed by CORS'))
// }

const whitelist = ['http://localhost:8000',"http://frontend.com","http://companyproject.org"];
var corsOptions = {
  origin: function (origin, callback) {
    if(!origin) return callback(null, true) // for thirdparty app (such as postman, curl)
    if (whitelist.indexOf(origin) !== -1) return callback(null, true)
    callback(new Error('Not allowed by CORS'))
  },
  credentials: true
}
app.use(cors(corsOptions));

// useful for POST/PUT
app.use(express.json());




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
