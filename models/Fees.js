const mongoose = require('mongoose');

const FeesSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    message: { type: String, required: true },
    amount: { type: Number, required: true },
    isPaid: { type: Boolean, default: false },
    transactionId: { type: String },
    paymentDate: { type: Date },
    validUtil: { type: Date },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Fees', FeesSchema);