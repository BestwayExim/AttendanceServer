const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,

    },
    profileImage: {
        type: String,
    },
    username: {
        type: String,

    },
    email: {
        type: String,
        unique: true,
    },
    employeeId: {
        type: String,
        unique: true,
    },
    phone: {
        type: String,
    },
    designation: {
        type: String,
    },
    dateOfBirth: {
        type: Date,
    },
    salary: {
        type: Number,
    },
    password: {
        type: String,
    },
    otp: {
        type: String,
    },

    otpTimestamp: { type: Date },

    isVerified: {
        type: Boolean,
        default: false
    },

    role: {
        type: String,
        required: true,
        enum: ['admin', 'manager', 'teamlead', 'user', 'client', 'watcher', 'tester'],
        default: 'user'
    },
    projects: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Board',
    }],

    fcmTokens: {
        type: [String],
        default: []
    },
    checkInStartTime: {
        type: Date
    },
    checkinEndTime: {
        type: Date
    },
    checkOutStartTime: {
        type: Date
    },
    checkoutEndTime: {
        type: Date
    }

}, { timestamps: true });


const User = mongoose.model('User', userSchema);
module.exports = User;