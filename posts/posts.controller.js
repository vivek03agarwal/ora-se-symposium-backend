const express = require('express');
const postRouter = express.Router();
const postService = require('./post.service');
const userService = require('../users/user.service');
const Role = require('../_helpers/role');


// routes
postRouter.post('/create', create);
postRouter.get('/', getAll);
postRouter.get('/feed/:timestamp', getLatest);
postRouter.get('/deleted/', getDeleted);
postRouter.get('/:id', getById);
postRouter.put('/:id', _delete);
postRouter.post('/:id/likePost', likePost);
postRouter.post('/:id/unlikePost', unlikePost);


module.exports = postRouter;

function create(req, res, next) {
    postService.create(req.body.postContent, req.user.sub)
        .then(curPost => userService.pushPosts(req.user.sub,curPost._id))
        .then(() => res.status(200).json({ message: 'Posted Succesfully' }))
        .catch(err => next(err));
}

function getAll(req, res, next) {
    postService.getAll()
        .then(postService => res.json(postService))
        .catch(err => next(err));
}

function getLatest(req, res, next) {
    const currentUser = req.user;
    postService.getLatest(req.params.timestamp, currentUser.sub)
        .then(posts => posts ? res.json(posts) : res.sendStatus(404))
        .catch(err => next(err));
}

function getDeleted(req, res, next) {
    console.info(req.user + "----")
    const currentUser = req.user;
    postService.getDeleted(currentUser.sub)
    .then(post => post ? res.json(post) : res.sendStatus(404))
    .catch(err => next(err));
}

function getById(req, res, next) {
    postService.getById(req.params.id)
        .then(post => post ? res.json(post) : res.sendStatus(404))
        .catch(err => next(err));
}

function _delete(req, res, next) {
    const currentUser = req.user;
    var _userid
    postService.getById(req.params.id).then(function (post){
        _userid = post.createdById;
        if (_userid !== currentUser.sub && currentUser.role !== Role.Admin) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
    });
    postService.delete(req.params.id, req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}
function likePost(req, res, next) {
    userService.getById(req.user.sub)
    .then(curUser => postService.hitLike(req.params.id,curUser))
    .then( post => post ? res.status(200).json({ message: 'Liked Post Succesfully' }):res.status(404).json({ message: 'Cannot Like Post' }) )
        .catch(err => next(err));
}

function unlikePost(req, res, next) {
    userService.getById(req.user.sub)
    .then(curUser => postService.hitUnLike(req.params.id,curUser))
    .then( post => post ? res.status(200).json({ message: 'Unliked Post Succesfully' }):res.status(404).json({ message: 'Cannot Unlike Post' }) )
    .catch(err => next(err));
}