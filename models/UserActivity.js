const mongoose = require('mongoose');

const userActivitySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    activityCount: { type: Number, default: 1 },
    date: { type: Date, required: true }
});

module.exports = mongoose.model('UserActivity', userActivitySchema);