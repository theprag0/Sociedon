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
        status: {
            type: String,
            default: 'offline'
        },
        socketId: [
            {
                type: String,
                required: true
            }
        ],
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
        ],
        friendRequests: [
            {
                from: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User'
                },
                status: {
                    type: 'String',
                    default: 'Pending'
                }
            }
        ]
    }
);

module.exports = mongoose.model('User', userSchema);