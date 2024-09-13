const mongoose = require('mongoose');

const lateComingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    date: {
        type: Date,
        required: true
    },
    arrivalTime: {
        type: Date,
        required: true
    },
    reason: {
        type: String,
        required: true
    }

}, { timestamps: true });


const LateComing = mongoose.model('LateComing', lateComingSchema);

module.exports = LateComing;