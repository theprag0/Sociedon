const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const DM = require('../../models/DM');
const Arena = require('../../models/Arena');
const auth = require('../../middleware/auth');
const getUserConversations = require('../../helpers/getUserConversations');

const returnRouter = io => {
    // @route GET /messenger/search
    // @desc Get user info with search query
    // @access Private
    router.post('/search', auth, async (req, res) => {
        try {
            const {query, type} = req.body;
            if(!query) return res.json({result: ['Search new friends!']});
            
            // Find users with query
            if (type === 'friends') {
                const foundUsers = await User.find(
                    {username: new RegExp(query, 'i'), _id: {$nin: req.user.id}}, 
                    {username: 1, _id: 1, friendRequests: 1},
                    {new: true}
                ).populate("friendRequests");
                
                // Return if no users found
                if(foundUsers.length === 0) return res.json({result: [{msg: 'No users found!'}]}); 

                // Check if current is already friends or has recieved a request from found user
                const currUser = await User.findOne({_id: req.user.id}, {friends: 1, friendRequests: 1}).populate('friendRequests');
                const filterResponse = foundUsers.filter(f => {
                    const isFriend = currUser.friends.includes(f._id);
                    const hasRequested = currUser.friendRequests.some(request => request.from.equals(f._id));
                    if(!isFriend && !hasRequested) {
                        return f;
                    }
                });

                // Check if user already has a friend request from current-user 
                const mapResponse = filterResponse.map(f => {
                    if(f.friendRequests.length > 0) {
                        for(r of f.friendRequests) {
                            if(r.from.equals(req.user.id)) {
                                return {username: f.username, _id: f._id, sent: true}
                            } 
                        }
                    }
                    return {username: f.username, _id: f._id};
                });
                if(mapResponse.length === 0) return res.json({result: [{msg: 'No users found!'}]}); 
                // Return found users
                return res.status(200).json({result: mapResponse});
            } else {
                const foundArenas = await Arena.find({name: new RegExp(query, 'i')}, {name: 1, _id: 1});
                if(foundArenas.length === 0) return res.json({result: [{msg: 'No arenas found!'}]});
                return res.status(200).json({result: foundArenas});
            }
        } catch(err) {
            console.log(err);
        }
    });
    
    // @route PUT /messenger/add
    // @desc Send, Accept or Decline friend requests to/from users
    // @access Private
    router.put('/add', auth, async (req, res) => {
        try {
            if(req.body.type === 'newRequest'){

                const {from, recipient} = req.body;
                const newRequest = {from, status: 'Pending'}
                const recipientUser = await User.findOneAndUpdate({_id: recipient}, {
                    $push: {
                        friendRequests: newRequest
                    }
                }, {new: true});
                if(!recipientUser) return res.status(400).json({
                    msg: "Couldn't send friend request, Please try again later.", 
                    status: 'failed'
                });
                
                // Check if recipient is online and emit notification
                const fromUser = await User.findOne({_id: from}, {username: 1});
                if(recipientUser && recipientUser.status === 'online') {
                    recipientUser.socketId.forEach(socket => {
                        io.to(socket).emit('newFriendRequest', {
                            fromUsername: fromUser.username, 
                            fromId: from,
                            status: newRequest.status
                        });
                    })
                }
        
                return res.json({
                    msg: 'Request sent successfully!', 
                    status: 'success'
                });
            } else if(req.body.type === 'requestActions') {
                // Accept or Reject friend request
                const {fromId, currUserId} = req.body;
                if(req.body.action === 'accept') {
                    const addFriendAInB = await User.findByIdAndUpdate({_id: currUserId}, {$push: {friends: fromId}});
                    if(addFriendAInB) {
                        const addFriendBInA = await User.findByIdAndUpdate({_id: fromId}, {$push: {friends: currUserId}})
                        if(addFriendBInA) {
                            await User.findByIdAndUpdate({_id: currUserId}, {$pull: {
                                friendRequests: {from: fromId}
                            }});
                        }
                    }
                    if(!addFriendAInB) return res.json({msg: 'Failed to accept friend request, Please try again later.'});
                    return res.json({msg: 'Friend added!'});
                } else if(req.body.action === 'decline') {
                    await User.findByIdAndUpdate({_id: currUserId}, {$pull: {
                        friendRequests: {from: fromId}
                    }});
                    return res.json({msg: 'Friend request declined!'});
                }
            }
        } catch(err) {
            console.log(err);
        }
    });

    // @route GET /messenger/retrieve/:type/:userId
    // @desc Retrieve various data(pending requests, online friends etc.) for messenger
    // @access Private
    router.get('/retrieve/:type/:userId', auth, async (req, res) => {
        if(req.params.type === 'friendRequests') {
            const pendingRequests = await User.findById({_id: req.params.userId}, {friendRequests: 1}).populate('friendRequests.from', 'username');
        
            if(pendingRequests.length === 0 || !pendingRequests) {
                return res.json({msg: 'No Pending Requests!'});
            }
    
            const filterRequests = pendingRequests.friendRequests.map(p => (
                {fromId: p.from._id, fromUsername: p.from.username, status: p.status}
            ));
            return res.json({requests: filterRequests});
        } else if(req.params.type === 'conversations') {
            // Send user's conversations/direct messages on connection
            const userId = req.params.userId;
            const userDms = await DM.find({users: {$in: userId}}).populate('users', 'username status defaultImage');
            
            if(userDms && userDms.length > 0) {
                const userConversations = getUserConversations(userDms, userId);
                if(userConversations && userConversations.length > 0) {
                    return res.json({conversations: userConversations});
                }
            } else {
                return res.json({msg: 'No conversations yet!'});
            }
        }
    });

    // @route POST /messenger/messages
    // @desc Send all messages in DM
    // @access Private
    router.post('/messages', auth, async (req, res) => {
        const {type} = req.body;
        if(type === 'dm') {
            const {userA, userB} = req.body;
            
            // Check if DM exists
            const existingDm = await DM.findOne({users: {$size: 2, $all: [userA, userB]}});
            if(!existingDm) return res.json({msg: 'No existing DM doc'});
            return res.json({messages: existingDm.messages});
        }
    });

    return router;
}

module.exports = returnRouter;