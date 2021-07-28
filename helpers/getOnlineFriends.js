function getOnlineFriends(friendsArray, allOnlineUsers) {
    const filterArr = allOnlineUsers.filter(u => friendsArray.includes(u.user._id));
    const onlineFriends = filterArr.map(el => ({userId: el.user._id, username: el.user.username, status: el.status}));
    return onlineFriends;
}

module.exports = getOnlineFriends;