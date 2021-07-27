const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const onlineSchema = new Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        status: {
            type: String,
            required: true
        },
        socketId: [{
            type: String,
            required: true
        }]
    }
);

module.exports = mongoose.model('Online', onlineSchema)