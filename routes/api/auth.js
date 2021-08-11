const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const auth = require('../../middleware/auth');
const User = require('../../models/User');

// @route POST /api/auth/login
// @desc Authenticate User
// @access Public
router.post('/login', async (req, res) => {
    try{
        const {email, password} = req.body;
        
        // Validate fields 
        if(!email || !password) return res.status(400).json({msg: 'Please enter all fields'});

        const foundUser = await User.findOne({email});
        if(!foundUser) return res.status(400).json({msg: 'User does not exist.'});
        bcrypt.compare(password, foundUser.password)
        .then(isMatch => {
            if(!isMatch) return res.status(400).json({msg: 'Invalid Credentials!'});
            jwt.sign({id: foundUser._id}, process.env.JWT_SECRET, (err, token) => {
                if(err) throw err;
                res.json({
                    token,
                    user: {
                        username: foundUser.username,
                        email: foundUser.email,
                        id: foundUser._id
                    }
                });
            });
        });
    } catch(err) {
        console.log(err);
    }
});

// @route GET /api/auth/user
// @desc Get user information
// @access Private
router.get('/user', auth, async (req, res) => {
    try{
        const foundUser = await User.findById(req.user.id).select('-password');
        if(!foundUser) return res.status(404).json({msg: "Invalid token or user doesn't exist"});
        if(foundUser) return res.json({
            username: foundUser.username,
            email: foundUser.email,
            userId: foundUser._id,
            avatar: foundUser.avatar
        });
    } catch(err) {
        console.log(err);
    }
});

module.exports = router;