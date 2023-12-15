const workoutRouter = require('express').Router()
const {  Set, Exercise, Workout, } = require('../models/workout')

workoutRouter.get('/', async (request, response) => {
    const workouts = await Workout.find({}).sort({ createdAt: -1})
    response.json(workouts)
})

workoutRouter.get('/:id', async (request, response) => {
    const { id } = request.params
    const foundWorkout = await Workout.findById(id)
    if (foundWorkout) {
        response.json(foundWorkout)
    } 
    else {
        response.status(404).json({message:'workout not found'})
    }
})

workoutRouter.post('/', async (request, response) => {
    const { title } = request.body
    const workout = new Workout({
        title, 
    })
    const savedWorkout = await workout.save()
    response.status(201).json(savedWorkout)
})

workoutRouter.post('/addexercise/:id', async (request, response) => {
    const workout = await Workout.findById(request.params.id)
    const exercise = new Exercise({
        title: request.body.title, 
        sets: [
            new Set({
                weight: 0, 
                reps: 0
            })
        ]
    })
    workout.exercises = workout.exercises.concat(exercise)
    await workout.save()
    response.status(201).json(exercise)
})

workoutRouter.post('/removeexercise/:id', async (request, response) => {
    const workout = await Workout.findById(request.params.id)
    workout.exercises = workout.exercises.filter(exercise => exercise._id != request.body._id)
    await workout.save()
    response.status(204).end()
})

workoutRouter.post('/addset/:id', async (request, response) => {
    const workout = await Workout.findById(request.params.id)
    const exercise = workout.exercises.find(exercise => exercise._id == request.body._id)
    const set = new Set({
        weight: 0, 
        reps: 0
    })
    exercise.sets = exercise.sets.concat(set)
    await workout.save()
    response.status(201).json(set)
}) 

workoutRouter.post('/removeset/:id', async (request, response) => {
    const workout = await Workout.findById(request.params.id)
    const exercise = workout.exercises.find(exercise => exercise._id == request.body._exerciseid)
    exercise.sets = exercise.sets.filter(set => set._id != request.body._setid)
    await workout.save()
    response.status(204).end()
})

workoutRouter.post('/:id', async (request, response) => {
    const updatedWorkout = await Workout.findByIdAndUpdate(request.params.id, request.body, { new: true, context: 'query' })
    response.status(201).json(updatedWorkout)
})

workoutRouter.delete('/:id', async (request, response) => {
    await Workout.findByIdAndDelete(request.params.id)
    response.status(204).end()
})

module.exports = workoutRouter