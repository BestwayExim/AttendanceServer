const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'UserId is Required']
    },
    date: {
        type: Date,
        required: [true, 'Date is Required']
    },
    checkIn: {
        type: Date,
        required: [true, 'CheckIn is Required']
    },
    checkout: {
        type: Date,
    },
    isCheckedIn: {
        type: Boolean,
        default: false
    },
    isCheckedOut: {
        type: Boolean,
        default: false
    },
    isLateArrived: {
        type: Boolean,
        default: false
    },
    isLeave: {
        type: Boolean,
        default: false
    }

}, { timestamps: true });


const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;