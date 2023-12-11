const mongoose = require('mongoose')

const setSchema = new mongoose.Schema({
    weight: Number, 
    reps: Number, 
})

const exerciseSchema = new mongoose.Schema({
    title: String, 
    sets: [setSchema], 
})

const workoutSchema = new mongoose.Schema({
    title: String, 
    exercises: [exerciseSchema],
},  { timestamps: true })

const Set = mongoose.model('Set', setSchema)
const Exercise = mongoose.model('Exercise', exerciseSchema)
const Workout = mongoose.model('Workout', workoutSchema)


module.exports = {
    Set,
    Exercise,
    Workout, 
}