const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()
// Comment out this line when pushing to git
// const workoutRouter = require('./controllers/workout')
const workoutRouter = require('./controllers/Workout')
const exerciseRouter = require('./controllers/exercise')

mongoose.set('strictQuery', false)
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB')
    })
    .catch((error) => {
        console.log('Error connecting to MongoDB:', error.message)
    })

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use('/api/workout', workoutRouter)
app.use('/api/exercise', exerciseRouter)

module.exports = app