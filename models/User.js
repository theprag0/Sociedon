const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true
        },
        username: {
            type: String, 
            required: true
        },
        password: {
            type: String,
            required: true
        },
        dob: {
            type: Date,
            required: true
        },
        registeredAt: {
            type: Date,
            default: Date.now
        },
        friends: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }
        ],
        arenas: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Arena'
            }
        ]
    }
);

module.exports = mongoose.model('User', userSchema);