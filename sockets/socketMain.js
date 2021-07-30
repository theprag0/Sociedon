const User = require('../models/User');

async function socketMain(io, socket, userId) {
    const currUser = await User.findById({_id: userId}, {friends: 1}).populate('friends', 'username status defaultImage');
    socket.emit('friendsList', {friends: currUser.friends});
}

module.exports = socketMain;