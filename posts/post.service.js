const config = require('../config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../_helpers/db');

const post = db.Post;

module.exports = {
    getAll,
    getById,
    getLatest,
    getDeleted,
    create,
    delete: update,
    hitLike,
    hitUnlike
};


async function getAll() {
    return await post.find();
}

async function getById(id) {
    return await post.findById(id);
}

async function getLatest(timestamp, _curUser){
    var d_timestamp = new Date(timestamp);
    var latest_posts = await (post.find({$and:[{createdDate: {$gt: d_timestamp}}, {isDeleted: false}]}).sort('-createdDate').populate({path: 'likes.User',model:'User'}));
    for (const [ key, value ] of Object.entries(latest_posts)){
        if (latest_posts[key].createdBy == _curUser){
            latest_posts[key].isOwned = true;
        }
        if (latest_posts[key].likes.indexOf(_curUser)!= -1){
            latest_posts[key].isLiked = true;
        }
    }
    return latest_posts;
}

async function getDeleted(_curUser){
    var deleted_posts = await post.find({isDeleted: true});
    for (var i = 0; i < deleted_posts.length; i++) {
        if (deleted_posts[i].createdById === _curUser) {
            deleted_posts[i].isOwned = true;
        }
      }
    return deleted_posts
}

async function create(postBody,_curUserId) {
    return await post.create({"postContent":postBody, "createdBy": _curUserId});
}

async function update(id,postParam) {
    return await post.findOneAndUpdate({"_id": id },{ $set: postParam});
}

async function hitLike(id,_user) {
    return await post.findOneAndUpdate({"_id": id },{$inc: { "likeCount": 1},$addToSet: {likes: _user}});
}

async function hitUnlike(id,_user) {
    return await post.findOneAndUpdate({"_id": id },{ $inc: { "likeCount": -1},$pull: {likes: _user}});
}
