const mongoose = require('mongoose');

const workFromHomeSchema = new mongoose.Schema({
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


const WorkFromHome = mongoose.model('WorkFromHome', workFromHomeSchema);

module.exports = WorkFromHome;