const exerciseRouter = require('express').Router()
const exerciseJSON = require('../data/exercises.json')

exerciseRouter.get('/', async (request, response) => {
    response.json(exerciseJSON)
})

module.exports = exerciseRouter