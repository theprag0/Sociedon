const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const Arena = require('../../models/Arena');
const Online = require('../../models/Online');
const auth = require('../../middleware/auth');

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
    
                // Check if user already has a friend request from current-user 
                const filterResponse = foundUsers.map(f => {
                    if(f.friendRequests.length > 0) {
                        for(r of f.friendRequests) {
                            if(r.from.equals(req.user.id)) {
                                return {username: f.username, _id: f._id, sent: true}
                            } 
                        }
                    }
                    return {username: f.username, _id: f._id};
                });
                
                // Return found users
                return res.status(200).json({result: filterResponse});
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
    // @desc Send friend requests to users
    // @access Private
    router.put('/add', async (req, res) => {
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
                const recipientIsOnline = await Online.findOne({user: recipient});
    
                if(recipientIsOnline && recipientIsOnline.status === 'online') {
                    recipientIsOnline.socketId.forEach(socket => {
                        io.to(socket).emit('newFriendRequest', {
                            fromUsername: fromUser.username, 
                            fromId: from,
                            status: newRequest.status
                        });
                    })
                }
                // for(const [key, value] of req.io.sockets.sockets.entries()){
                //     if(value.handshake.query.userId.toString() === recipient.toString()) {
                //         if(value.connected) {
                //             req.io.to(key).emit('newFriendRequest', {fromUsername: fromUser.username, fromId: from});
                //         }
                //     }
                // }
        
                return res.json({
                    msg: 'Request sent successfully!', 
                    status: 'success'
                });
            } else if(req.body.type === 'requestActions') {
                // Accept or Reject friend request
            }
        } catch(err) {
            console.log(err);
        }
    });

    // @route GET /messenger/add/requests/:userId
    router.get('/add/requests/:userId', async (req, res) => {
        const pendingRequests = await User.findById({_id: req.params.userId}, {friendRequests: 1}).populate('friendRequests.from', 'username');
    
        if(pendingRequests.length === 0 || !pendingRequests) {
            return res.json({msg: 'No Pending Requests!'});
        }

        const filterRequests = pendingRequests.friendRequests.map(p => (
            {fromId: p.from._id, fromUsername: p.from.username, status: p.status}
        ));
        return res.json({requests: filterRequests});
    });

    return router;
}

module.exports = returnRouter;