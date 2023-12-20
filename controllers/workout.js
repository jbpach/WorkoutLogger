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

workoutRouter.post('/again/:id', async (request, response) => {
    const foundWorkout = await Workout.findById(request.params.id)
    const workoutObj = foundWorkout.toObject()
    delete workoutObj['_id']
    delete workoutObj['createdAt']
    delete workoutObj['updatedAt']
    delete workoutObj['__v']
    workoutObj.exercises.forEach(element => {
        delete element['_id']
        element.sets.forEach(item => {
            delete item['_id']
        })
    })
    const savedWorkout = await new Workout({...workoutObj}).save()
    response.status(201).json(savedWorkout)
})

workoutRouter.delete('/:id', async (request, response) => {
    await Workout.findByIdAndDelete(request.params.id)
    response.status(204).end()
})

workoutRouter.get('/facts/:id', async (request, response) => {
    const workout = await Workout.findById(request.params.id)
    const totalSets = workout.exercises.reduce((total, item) => {
        return total + item.sets.length
    }, 0)
    const totalReps = workout.exercises.reduce((mainTotal, item) => {
        return mainTotal + item.sets.reduce((total, item) => {
            return total + item.reps
        }, 0)
    }, 0)
    const mostSets =  workout.exercises.reduce((a, b) => {
        return a.sets.length > b.sets.length  ? a : b
    }, workout.exercises[0])
    const totalWeight = workout.exercises.reduce((mainTotal, item) => {
        return mainTotal + item.sets.reduce((total, item) => {
            return total + item.weight
        }, 0)
    }, 0)
    const heaviestWeight =  workout.exercises.reduce((a, b) => {
        let heavy = b.sets.reduce((c, d) => {
            return c.weight > d.weight ? c : d
        }, b.sets[0]) 
        return a > heavy.weight ? a : heavy.weight
    }, 0)
    const obj = {
        'totalSets': totalSets, 
        'totalReps': totalReps, 
        'mostSets': mostSets.title, 
        'totalWeight': totalWeight, 
        'heaviestWeight': heaviestWeight, 
        'workout': workout
    }
    response.json(obj)
})

module.exports = workoutRouter