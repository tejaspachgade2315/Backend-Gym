const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,
        trim: true,
        match: [/^\+?[1-9]\d{9,14}$/, 'Please enter a valid phone number']
    },
    status: {
        type: String,
        enum: ['pending', 'converted', 'loss'],
        default: 'pending'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Lead', leadSchema);