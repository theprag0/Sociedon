const User = require('../models/User');
const DM = require('../models/DM');

async function socketMain(io, socket, userId) {
    const currUser = await User.findById({_id: userId}, {friends: 1}).populate('friends', 'username status defaultImage');
    socket.emit('friendsList', {friends: currUser.friends});

    // Listen for new private message
    socket.on('private message', async (data, callback) => {
        const recipientUser = await User.findOne({_id: data.recipient}, {status: 1, socketId: 1});

        // Find existing DM document and update new message
        const existingDm = await DM.findOne({users: {$size: 2, $all: [userId, data.recipient]}});
        let newMsgDoc;
        if(!existingDm) {
            const newDm = new DM({users: [userId, data.recipient]});
            newDm.messages = [{from: data.from, recipient: data.recipient, message: data.message}];
            newMsgDoc = await newDm.save();
        } else {
            newMsgDoc = await DM.findOneAndUpdate({users: {$size: 2, $all: [userId, data.recipient]}}, {
                $push: {messages: {
                    from: data.from,
                    recipient: data.recipient,
                    message: data.message
                }
            }});
        }

        // Emit message to recipient
        if(recipientUser.status === 'online' && recipientUser.socketId.length > 0) {
            recipientUser.socketId.forEach(socket => io.to(socket).emit('private message', data));
        }
        if(newMsgDoc) {
            callback({msg: {...data, status: 'sent'}});
        }
    });
}

module.exports = socketMain;