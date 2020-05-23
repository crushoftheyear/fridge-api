import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import Grocery from './models/grocery.js'

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/fridge'
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

// Defines the port the app will run on. Defaults to 8080, but can be 
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

const listEndpoints = require('express-list-endpoints')

const error_couldNotSave = 'Could not save grocery to the database'

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

// Root
app.get('/', (req, res) => {
  res.send(listEndpoints(app))
})

// Groceries
app.get('/groceries', async (req, res) => {
  const allGroceries = await Grocery.find()
  res.send(allGroceries)
})

// Post new grocery
app.post('/groceries', async (req, res) => {
  // Retrieve information from client to endpoint
  const { name, category } = req.body

  // Create DB entry
  const grocery = new Grocery({ name, category })

  try {
    // Success
    const savedGrocery = await grocery.save()
    res.status(201).json(savedGrocery)
  } catch (err) {
    res.status(400).json({ message: error_couldNotSave, error: err.errors })
  }
})

// Delete grocery
app.delete('/groceries/:id', async (req, res) => {
  const { id } = req.params

  try {
    await Grocery.findOneAndDelete({ _id: id })
    res.status(202).json({ message: "Deleted grocery" })
  } catch (err) {
    res.status(404).json({ message: "Can't delete the grocery", error: err.errors })
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
