const User = require('../models/User');
const DM = require('../models/DM');

async function socketMain(io, socket, userId) {
    const currUser = await User.findById({_id: userId}, {friends: 1}).populate('friends', 'username status avatar');
    // Send user's friends on connection
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
            }}, {new: true});
        }

        // Emit message to recipient
        if(recipientUser.status === 'online' && recipientUser.socketId.length > 0) {
            const newMsgId = newMsgDoc.messages[newMsgDoc.messages.length - 1]._id;
            const newData = {...data, _id: newMsgId};
            recipientUser.socketId.forEach(socket => io.to(socket).emit('private message', newData));
        }
        if(newMsgDoc) {
            callback({msg: {...data, status: 'sent'}});
        }
    });

    // Save user's last seen message
    socket.on('last-seen message', async data => {
        // Check if user already has a last-seen message
        const foundDm = await DM.findOne({users: {$size: 2, $all: [data.by, data.from]}});
        if(foundDm) {
            foundDm.lastSeenMessage.forEach(async m => {
                if(m.by.toString() === data.by) {
                    await DM.findOneAndUpdate({users: {$size: 2, $all: [data.by, data.from]}}, {
                        $pull: {lastSeenMessage: {
                            by: data.by
                        }}
                    });   
                    return;
                }
            });
            await DM.findOneAndUpdate({users: {$size: 2, $all: [data.by, data.from]}}, {
                $push: {lastSeenMessage: {
                    by: data.by,
                    messageId: data.messageId
                }}
            });       
        }
    });
}

module.exports = socketMain;