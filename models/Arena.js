const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const arenaSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true
        },
        arenaAccess: {
            type: String,
            default: 'public',
            required: true
        },
        admin: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        rooms: [
            {
                name: {
                    type: String,
                    required: true,
                    unique: true
                },
                messages: [
                    {
                        message: String,
                        from: {
                            type: mongoose.Schema.Types.ObjectId,
                            ref: 'User'
                        },
                        timestamp: {
                            type: Date,
                            default: Date.now
                        }
                    }
                ]    
            }
        ],
        members: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }
        ],
        createdAt: {
            type: Date,
            default: Date.now
        }
    }
);

module.exports = mongoose.model('Arena', arenaSchema);