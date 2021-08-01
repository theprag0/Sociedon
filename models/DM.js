const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dmSchema = new Schema(
    {
        users: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }
        ],
        messages: [
            {
                message: String,
                from: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User'
                },
                recipient: {
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
);

module.exports = mongoose.model('DM', dmSchema);