const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const Arena = require('../../models/Arena');
const auth = require('../../middleware/auth');

// @route GET /messenger/search/users
// @desc Get user info with search query
// @access Private
router.post('/search', auth, async (req, res) => {
    try {
        const {query, type} = req.body;
        if(!query) return res.json({result: ['Search new friends!']});

        // Find users with query
        if (type === 'friends') {
            const foundUsers = await User.find({username: new RegExp(query, 'i')}, {username: 1, _id: 1});
            if(foundUsers.length === 0) return res.json({result: [{msg: 'No users found!'}]}); 
            return res.status(200).json({result: foundUsers});
        } else {
            const foundArenas = await Arena.find({name: new RegExp(query, 'i')}, {name: 1, _id: 1});
            if(foundArenas.length === 0) return res.json({result: [{msg: 'No arenas found!'}]});
            return res.status(200).json({result: foundArenas});
        }
    } catch(err) {
        console.log(err);
    }
});


module.exports = router;