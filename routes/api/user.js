const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../../models/User');

// @route POST /api/user/registered
// @desc Register new User
// @access Public
router.post('/register', async (req, res) => {
    try {
        const {email, username, dob, password} = req.body;

        // Validate fields
        if(!email || !username || !dob || !password) return res.status(400).json({msg: 'Please enter all fields!'});

        // Check for existing user
        const existingUser = await User.findOne({email});
        if(existingUser) return res.status(400).json({msg: 'User already exists, use a different email.'});

        // Generate date string
        const dobIso = new Date(`${dob}T00:00:00Z`);
        const newUser = new User({email, username, dob: dobIso, password});

        // Hash Password
        bcrypt.genSalt(10, (err, salt) => {
            if(err) throw err;
            bcrypt.hash(newUser.password, salt, async (err, hash) => {
                if(err) throw err;
                newUser.password = hash;
                // Save user
                const saveUser = await newUser.save();
                if(saveUser) {
                    jwt.sign({id: saveUser.id}, process.env.JWT_SECRET, {expiresIn: 3600}, (err, token) => {
                        if(err) throw err;
                        res.json({
                            token,
                            user: {
                                username: saveUser.username,
                                email: saveUser.email,
                                id: saveUser._id
                            }
                        });
                    });
                } 
            });
        });
    } catch(err) {
        console.log(err);
        res.status(500).json({msg: 'Something went wrong, Please try again later'});
    }
});

module.exports = router;