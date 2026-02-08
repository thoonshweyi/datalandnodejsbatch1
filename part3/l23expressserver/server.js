const express = require('express')
const app = express()
const port = 3000

// Get - Retrieve single item
app.get('/api/items', (req, res) => {
    res.json([
      {id:1,name:"Item 1",price:10},
      {id:2,name:"Item 2",price:20},
      {id:3,name:"Item 3",price:30},
      {id:4,name:"Item 4",price:40},
      {id:5,name:"Item 5",price:50},
    ]);
})

app.get('/api/items/:id', (req, res) => {
  const item = {id:parseInt(req.params.id),name:`Item ${req.params.id}`,price:1000}
  res.json(item)
})

app.post('/api/items', express.json() ,(req, res) => {
  
  const newitem = {
    id: Date.now(),
    name: req.body.name,
    price:req.body.price
  }
  res.status(201).json(newitem)
})

app.put('/api/items/:id', express.json() ,(req, res) => {
  
  const updateitem = {
    id: parseInt(req.params.id),
    name: req.body.name,
    price:req.body.price
  }
  res.json(updateitem)
})



// DELETE - Retrieve single item
app.delete('/api/items/:id', (req, res) => {
  res.json({message:`Item ${req.params.id} deleted successfully`})
})


app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`)
})
