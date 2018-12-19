const config = require('../config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../_helpers/db');
const event = db.Event;

module.exports = {
    getAll,
    getByUser,
    create,
    toggleRegistration,
    getUsersPerEvent
};


async function getAll() {
    return await event.find();
}

async function getByUser(_userid) {
    return await event.find({users:_userid});
}

async function getUsersPerEvent(_eventName) {
   return await event.find({eventName:_eventName}).lean().populate('users', 'firstName lastName mobileNumber');
}


async function create(_eventName) {
    return await event.create({"eventName":_eventName});
}

async function toggleRegistration(_eventName,_user) {
    _event = await event.findOne({eventName:_eventName}).populate({path:'users',model:'User'});
    if(_event.users.indexOf(_user.id)==-1){
        return await event.findByIdAndUpdate(_event._id, {$addToSet: {"users": _user}, $inc: { "regCount": 1}});
    }
    else{
        return await event.findByIdAndUpdate(_event._id, {$pull: {"users": _user._id}, $inc: { "regCount": -1}});
    }
}
