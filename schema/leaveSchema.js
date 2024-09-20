const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'UserId is Required']
    },
    startDate: {
        type: Date,
        required: [true, 'Start Date is Required']
    },
    endDate: {
        type: Date,
        required: [true, 'End Date is Required']
    },
    isAdminApproved: {
        type: Boolean,
        default: false
    },
    approvedStatus: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    reason: {
        type: String,
        required: [true, 'Reason is Required']
    }

}, { timestamps: true });


const Leave = mongoose.model('Leave', leaveSchema);

module.exports = Leave;