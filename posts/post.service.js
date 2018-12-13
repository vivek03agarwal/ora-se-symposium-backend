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
    toggleLike
};


async function getAll() {
    return await post.find();
}

async function getById(id) {
    return await post.findById(id);
}

async function getLatest(timestamp, _curUser){
    var d_timestamp = new Date(timestamp);
    var latest_posts = await (post.find({$and:[{createdDate: {$gt: d_timestamp}}, {isDeleted: false}]})
        .sort('-createdDate')
        .populate('likes.User','id')
        .populate('createdBy', 'firstName lastName'));

    for (const [ key, value ] of Object.entries(latest_posts)){
        if (latest_posts[key].createdBy.id == _curUser){
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
    return await post.create({"postContent":postBody.postContent, "imgUrls": postBody.imgUrls , "createdBy": _curUserId});
}

async function update(id,postParam) {
    return await post.findByIdAndUpdate(id,{ $set: postParam});
}

async function toggleLike(id,_user) {
    _post = await post.findById(id).populate({path:'likes.User',model:'User'});
    if(_post.likes.indexOf(_user.id)==-1){
        return await post.findByIdAndUpdate(id, {$addToSet: {"likes": _user}, $inc: { "likeCount": 1}});
    }
    else{
        return await post.findByIdAndUpdate(id, {$pull: {"likes": _user._id}, $inc: { "likeCount": -1}});
    }
}
