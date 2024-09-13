const mongoose = require('mongoose');

const lateComingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'UserId is Required']
    },
    date: {
        type: Date,
        required: [true, 'Date is Required']
    },
    arrivalTime: {
        type: Date,
        required: [true, 'ArrivalTime is Required']
    },
    reason: {
        type: String,
        required: [true, 'Reason is Required']
    }

}, { timestamps: true });


const LateComing = mongoose.model('LateComing', lateComingSchema);

module.exports = LateComing;