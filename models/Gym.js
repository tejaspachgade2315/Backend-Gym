const mongoose = require('mongoose');
const { Schema } = mongoose;

const gymSchema = new Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, unique: true },
    website: { type: String },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    socialMedia: {
        facebook: { type: String },
        instagram: { type: String },
        twitter: { type: String },
    },
    image: [{ type: String }],
    openingHours: {
        monday: { type: String, default: '6:00 AM - 10:30 PM' },
        tuesday: { type: String, default: '6:00 AM - 10:30 PM' },
        wednesday: { type: String, default: '6:00 AM - 10:30 PM' },
        thursday: { type: String, default: '6:00 AM - 10:30 PM' },
        friday: { type: String, default: '6:00 AM - 10:30 PM' },
        saturday: { type: String, default: '6:00 AM - 10:30 PM' },
        sunday: { type: String, default: 'Closed' },
    },
    membershipPlans: {
        type: [Schema.Types.ObjectId],
        ref: 'Membership',
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Gym', gymSchema);