const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    hash: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    designation: {type: String, required: true},
    department: {type: String, required:true},
    location: {type: String, required: true},
    secret: {type:String},
    room_no: {type: String, required:true},
    role: {type: String, required: true, default: "User"},
    createdDate: { type: Date, default: Date.now },
    posts: [{ type:mongoose.Schema.Types.ObjectId, ref: 'Post'}],
    photos: [{type: String, required: false}],
    meets: [{ type:mongoose.Schema.Types.ObjectId, ref: 'User'}],
    achievementScore: {type: Number, default:0}
});

userSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('User', userSchema);