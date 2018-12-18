const express = require('express');
const eventRouter = express.Router();
const eventService = require('./event.service');
const userService = require('../users/user.service');


// routes
eventRouter.post('/create', create);
eventRouter.get('/', getAll);
eventRouter.get('/feed/:timestamp', getLatest);
eventRouter.get('/getEvent', getByUser);
eventRouter.get('/getUsersPerEvent', getUsersPerEvent);
eventRouter.post('/toggleRegistration', toggleRegistration);


module.exports = eventRouter;

function create(req, res, next) {
    eventService.create(req.body.eventName)
    .then(event => event ? res.status(200).json({ event}) : res.status(404).json({message:"Could not Create evenbr"}))
    .catch(err => next(err));
}

function getAll(req, res, next) {
    eventService.getAll()
        .then(eventService => res.json(eventService))
        .catch(err => next(err));
}

function getLatest(req, res, next) {
    const currentUser = req.user;
    eventService.getLatest(req.params.timestamp, currentUser.sub)
        .then(posts => posts ? res.json(posts) : res.sendStatus(404))
        .catch(err => console.info(err));
}


function getByUser(req, res, next) {
    eventService.getByUser(req.user.sub)
        .then(event => event ? res.json(event) : res.sendStatus(404))
        .catch(err => next(err));
}

function getUsersPerEvent(req, res, next) {
    eventService.getUsersPerEvent(req.body.eventName)
        .then(users => users ? res.json(users) : res.sendStatus(404))
        .catch(err => next(err));
}

function toggleRegistration(req, res, next) {
    userService.getById(req.user.sub)
        .then(curUser => eventService.toggleRegistration(req.body.eventName, curUser))
        .then( post => post ? res.status(200).json({ message:'Event Registration Succesful'}):res.status(404).json({ message: 'Cannot Register' }) )
        .catch(err => next(err));
}
