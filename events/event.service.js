const config = require('../config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../_helpers/db');
const event = db.Event;

module.exports = {
    getAll,
    getByUser,
    create,
    toggleRegistration
};


async function getAll() {
    return await event.find();
}

async function getByUser(_userid) {
    var _event = await event.find();
    for (const [ key, value ] of Object.entries(_event)){
        if (_event[key].users.indexOf(_userid)!=-1){
            _event[key].isRegistered = true;
        }
    }
    return _event
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
