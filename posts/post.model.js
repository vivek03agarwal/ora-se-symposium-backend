const mongoose = require('mongoose');
const postSchema = new mongoose.Schema({
    postContent: { type: String, required: true },
    createdBy: {type:mongoose.Schema.Types.ObjectId, ref: 'User'},
    likeCount: {type: Number, min:0, default:0 },
    likes: [{ type:mongoose.Schema.Types.ObjectId, ref: 'User'}],
    isDeleted: {type: Boolean, default: false},
    isLiked: {type: Boolean, default: false},
    isOwned: {type: Boolean, default:false},
    createdDate: { type: Date, default: Date.now },
    imgUrls: [{type: String, default:"null"}]
});

postSchema.set('toJSON', { virtuals: true });
module.exports = mongoose.model('Post', postSchema);
