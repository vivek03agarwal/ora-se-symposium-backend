const express = require('express');
const userRouter = express.Router();
const userService = require('./user.service');
const Role = require('../_helpers/role');

// routes
userRouter.post('/authenticate', authenticate);
userRouter.post('/register', register);
userRouter.post('/initiateMeet',initiateMeet);
userRouter.get('/acceptMeet',acceptMeet);
userRouter.get('/', getAll);
userRouter.get('/current', getCurrent);
userRouter.get('/:id', getById);
userRouter.put('/:id', update);
userRouter.delete('/:id', _delete);

module.exports = userRouter;

function authenticate(req, res, next) {
    userService.authenticate(req.body)
        .then(auth_info => auth_info ? res.json(auth_info) : res.status(401).json({ message: 'Username or password is incorrect' }))
        .catch(err => next(err));
}

function register(req, res, next) {
    userService.create(req.body)
        .then(user => user ? res.sendStatus(200) : res.sendStatus(404))
        .catch(err => next(err));
}


function initiateMeet(req, res, next) {
    userService.initiateMeet(req)
        .then(meet => meet ? res.status(200).json({message: "Meeting Succeeded"}) : res.status(401).json({ message: 'Username or password is incorrect' }))
        .catch(err => next(err));
}

function acceptMeet(req, res, next) {
    userService.acceptMeet(req.user.sub)
        .then(secret => secret ? res.status(200).json({meetSecret: secret}) : res.status(401).json({ message: 'Could not Generate Secret' }))
        .catch(err => next(err));
}

function getAll(req, res, next) {
    const currentUser = req.user;
    // only allow admins to access other user records
    if (currentUser.role !== Role.Admin) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    userService.getAll()
        .then(users => res.json(users))
        .catch(err => next(err));
}

function getCurrent(req, res, next) {
    userService.getById(req.user.sub)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function getById(req, res, next) {

    const currentUser = req.user;
    const id = req.params.id;
    // only allow admins to access other user records
    if (id !== currentUser.sub && currentUser.role !== Role.Admin) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    userService.getById(req.params.id)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}


function update(req, res, next) {
    const currentUser = req.user;
    const id = req.params.id;
    console.info(currentUser.sub + "  " + id)
    if (id !== currentUser.sub && currentUser.role !== Role.Admin) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    userService.update(req.params.id, req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function _delete(req, res, next) {
    userService.delete(req.params.id)
        .then(() => res.json({}))
        .catch(err => next(err));
}