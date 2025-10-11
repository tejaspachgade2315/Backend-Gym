const mongoose = require('mongoose');

const passwordResetTokenSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    token: { type: String, required: true },
    resetAt: { type: Date },
    createdAt: { type: Date, required: true, default: Date.now, expires: 3600 }
});

module.exports = mongoose.model('PasswordResetToken', passwordResetTokenSchema);