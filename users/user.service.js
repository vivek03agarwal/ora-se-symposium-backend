const config = require('../config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../_helpers/db');
const user = db.User;
const randomizer = require('randomatic');

module.exports = {
    authenticate,
    getAll,
    getById,
    create,
    update,
    delete: _delete,
    pushPosts,
    initiateMeet,
    acceptMeet
};

async function authenticate({ username, password }) {
    var _username = username.toLowerCase();
    const _user = await user.findOne({username: _username});
    var _loginCount = _user.loginCount;
    await user.findByIdAndUpdate(_user.id,{$inc:{'loginCount':1}});
    if (_user && bcrypt.compareSync(password, _user.hash)) {
        const { hash, ...userWithoutHash } = _user.toObject();
        const token = jwt.sign({ sub: _user.id, role: _user.role }, config.secret);
        return {
            firstName: _user.firstName,
            lastName: _user.lastName,
            token: token,
            loginCount : _loginCount
        };
    }
}

async function getAll() {
    return await user.find().select('-hash');
}

async function getById(id) {
    return await user.findById(id).select('-hash');
}

async function create(userParam) {
    // validate
    if (await user.findOne({ username: userParam.username.toLowerCase() })) {
        throw 'username "' + userParam.username + '" is already taken';
    }
    const _user = new user(userParam);
    // hash password
    if (userParam.password) {
        _user.hash = bcrypt.hashSync(userParam.password, 10);
    }
    // save user
    await _user.save();
    return _user
}

async function update(id, userParam) {
    const _user = await user.findById(id);

    // validate
    if (!_user) throw 'user not found';
    if (_user.username !== userParam.username && await user.findOne({ username: userParam.username })) {
        throw 'username "' + userParam.username + '" is already taken';
    }

    // hash password if it was entered
    if (userParam.password) {
        userParam.hash = bcrypt.hashSync(userParam.password, 10);
    }

    // copy userParam properties to user
    Object.assign(_user, userParam);
    await _user.save();
}

async function pushPosts(id,_post){
    const _user = await user.findById(id);
    _user.posts.push(_post);
    await _user.save();
}

async function initiateMeet(meetParams){
    curUser = meetParams.user;
    var meetUser = await user.findOne({secret: meetParams.body.OTP.toUpperCase()});
    if (!meetUser){
        return null
    }
    if (meetUser.id != curUser.sub){
        await user.findByIdAndUpdate(meetUser,{$set: {"secret": ""}});
        await user.findByIdAndUpdate(curUser.sub,{$addToSet: {"meets": meetUser}});
        return {
            firstname: meetUser.firstName,
            lastname: meetUser.lastName,
            designation: meetUser.designation,
            location : meetUser.location
        };
    }
    else{
        return null
    }

}

async function acceptMeet(meetParams){
    curUser = meetParams;
    _secret = randomizer('A0',6);
    await user.findByIdAndUpdate(curUser,{$set: {"secret": _secret}});
    return _secret

}
async function _delete(id) {
    await user.findByIdAndRemove(id);
}
