const mongoose = require('mongoose');

const salarySchema = new mongoose.Schema({
    staffId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Staff' },
    salaryMonth: { type: String, required: true },
    salaryYear: { type: Number, required: true },
    amount: { type: Number, required: true },
    creditedDate: { type: Date, required: true },
    paymentMethod: { type: String, required: true, enum: ['Cash', 'Online', 'Cheque'] },
    status: { type: String, required: true, enum: ['Paid', 'Pending'] },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Salary', salarySchema);