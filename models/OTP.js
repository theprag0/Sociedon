const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const otpSchema = new Schema(
    {
        recipientEmail: {
            type: String,
            required: true
        },
        generatedOtp: {
            type: String,
            required: true
        },
        generatedOtpNum: {
            type: Number,
            default: 1
        },
        incorrectAttempts: {
            type: Number,
            default: 0 
        },
        createdAt: {
            type: Date,
            default: Date.now()
        }
    }
);

module.exports = mongoose.model('OTP', otpSchema);