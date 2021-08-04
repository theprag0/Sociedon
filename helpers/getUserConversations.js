const getUserConversations = (dmDocs, currUserId) => {
    const userConversations = dmDocs.map(dm => {
        const friend = dm.users.filter(user => user._id.toString() !== currUserId);
        const lastSeenMessage = dm.lastSeenMessage.filter(m => m.by.toString() === currUserId)[0];
        let lastMessageFromFriend;
        let unreadMessages = 0;
        for(let i = dm.messages.length - 1; i >= 0; i--) {
            if(dm.messages[i].from.toString() === friend[0]._id.toString()) {
                if(!lastMessageFromFriend) {
                    lastMessageFromFriend = dm.messages[i];
                }
                if(!lastSeenMessage || Object.keys(lastSeenMessage).length === 0) {
                    for(let i = dm.messages.length - 1; i >= 0; i--) {
                        if(unreadMessages < 16) {
                            unreadMessages++;
                        } else {
                            break;
                        }
                    }
                    break;
                }else if(lastSeenMessage.messageId.toString() === lastMessageFromFriend._id.toString()) {
                    break;
                } else {
                    if(dm.messages[i]._id.toString() === lastSeenMessage.messageId.toString()) {
                        break;
                    }
                    if(dm.messages[i].from.toString !== currUserId) {
                        if(unreadMessages < 16) {
                            unreadMessages += 1;
                        } else {
                            break;
                        }
                    }
                }
            }
        } 
        if(unreadMessages !== 0) {
            return {...friend[0].toObject(), lastMessageFromFriend, unreadMessages};
        } 
        return friend[0];
    });

    return userConversations;
}

module.exports = getUserConversations;