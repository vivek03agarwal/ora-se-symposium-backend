const mongoose = require('mongoose');
const eventSchema = new mongoose.Schema({
    eventName: {type: String, required: true },
    users: [{type:mongoose.Schema.Types.ObjectId, ref: 'User'}],
    regCount:{type: Number, default: 0},
    createdDate: { type: Date, default: Date.now },
    isRegistered: {type: Boolean, default: false}
});

eventSchema.set('toJSON', { virtuals: true });
module.exports = mongoose.model('Event', eventSchema);
