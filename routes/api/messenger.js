const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const Arena = require('../../models/Arena');
const auth = require('../../middleware/auth');

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
            console.log(foundUsers);
            
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
        return res.json({
            msg: 'Request sent successfully!', 
            status: 'success'
        });
    } catch(err) {
        console.log(err);
    }
});

module.exports = router;