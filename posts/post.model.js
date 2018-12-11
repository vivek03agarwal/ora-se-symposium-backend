const mongoose = require('mongoose');
const postSchema = new mongoose.Schema({
    postContent: { type: String, required: true },
    createdBy: { type: String, required: true},
    likeCount: {type: Number, min:0, default:0 },
    likes: [{ type:mongoose.Schema.Types.ObjectId, ref: 'User'}],
    isDeleted: {type: Boolean, default: false},
    isLiked: {type: Boolean, default: false},
    isOwned: {type: Boolean, default:false},
    createdDate: { type: Date, default: Date.now }
});

postSchema.set('toJSON', { virtuals: true });
module.exports = mongoose.model('Post', postSchema);
