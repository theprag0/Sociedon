const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const moment = require('moment');
const { customAlphabet } = require('nanoid');
const cloudinary = require('../../utils/cloudinary');
const User = require('../../models/User');
const OTP = require('../../models/OTP');
const emailServer = require('../../utils/sendEmail');


// @route POST /api/user/registered
// @desc Register new User
// @access Public
router.post('/register', async (req, res) => {
    try {
        const {email, username, dob, password, avatar, avatarType} = req.body;

        // Validate fields
        if(!email || !username || !dob || !password) return res.status(400).json({msg: 'Please enter all fields!'});
        if(!avatar) return res.status(400).json({msg: 'Please choose an avatar.'});

        // Check for existing user
        const existingUser = await User.findOne({email});
        if(existingUser) return res.status(400).json({msg: 'User already exists, use a different email.'});

        // Generate date string
        const dobIso = new Date(`${dob}T00:00:00Z`);
        const newUser = new User({email, username, dob: dobIso, password});

        if(avatarType === 'customAvatar') {
            const uploadAvatar = await cloudinary.uploader.upload(avatar, {
                upload_preset: 'sociedon'
            });
            if(uploadAvatar && Object.keys(uploadAvatar).length > 0) {
                newUser.avatar = {
                    avatarId: uploadAvatar.public_id,
                    avatarType
                }
            }
        } else {
            newUser.avatar = {
                avatarId: avatar,
                avatarType
            }
        }

        // Hash Password
        bcrypt.genSalt(10, (err, salt) => {
            if(err) throw err;
            bcrypt.hash(newUser.password, salt, async (err, hash) => {
                if(err) throw err;
                newUser.password = hash;
                // Save user
                const saveUser = await newUser.save();
                if(saveUser) {
                    jwt.sign({id: saveUser.id}, process.env.JWT_SECRET, (err, token) => {
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

// @route POST /register/verify
// @desc Verify user email with OTP
// @access Public
router.post('/register/verify', async (req, res) => {
    try{
        if(req.body.type === 'generateOtp') {
            const {email} = req.body;
            const otp = customAlphabet('0123456789', 6);
            
            // Check if user already has an OTP allocated
            const foundOtp = await OTP.findOne({recipientEmail: email});
            if(foundOtp && foundOtp.generatedOtpNum < 3) {
                console.log('generate again')
                const updateOtp = await OTP.findOneAndUpdate({recipientEmail: email}, {
                    $set: {
                        generatedOtp: otp(), 
                        generatedOtpNum: foundOtp.generatedOtpNum + 1, 
                        incorrectAttempts: 0,
                        createdAt: Date.now()
                    }
                }, {new: true});
                if(updateOtp) {
                    const response = await emailServer.sendOtpVerification(updateOtp.recipientEmail, updateOtp.generatedOtp);
                    if(response.accepted && response.accepted.length > 0) {
                        return res.json({
                            status: 'success', 
                            msg: 'OTP was sent to your email successfully',
                            generatedOtpNum: updateOtp.generatedOtpNum
                        });
                    } 
                    return res.json({status: 'error', msg: "Couldn't send OTP, Please try again"});
                }
            } else if(foundOtp && foundOtp.generatedOtpNum >= 3) {
                const currDate = moment(Date.now());
                const otpCreatedAt = moment(foundOtp.createdAt);
                const duration = moment.duration(currDate.diff(otpCreatedAt)).asHours();
                
                if(Math.round(duration) >= 24) {
                    const updateOtp = await OTP.findOneAndUpdate({recipientEmail: email}, {
                        $set: {
                            generatedOtp: otp(), 
                            generatedOtpNum: 1, 
                            incorrectAttempts: 0,
                            createdAt: Date.now()
                        }
                    }, {new: true});
                    if(updateOtp) {
                        const response = await emailServer.sendOtpVerification(updateOtp.recipientEmail, updateOtp.generatedOtp);
                        if(response.accepted && response.accepted.length > 0) {
                            return res.json({
                                status: 'success', 
                                msg: 'OTP was sent to your email successfully',
                                generatedOtpNum: updateOtp.generatedOtpNum
                            });
                        } 
                        return res.json({status: 'error', msg: "Couldn't send OTP, Please try again"});
                    }
                }
                return res.json({status: 'warning', msg: "You can't resend OTP with this email for 24 hours."});
            }

            // save otp 
            console.log('first time')
            const newOtpDoc = new OTP({recipientEmail: email, generatedOtp: otp()});
            const saveOtp = await newOtpDoc.save();
            if(saveOtp) {
                const response = await emailServer.sendOtpVerification(saveOtp.recipientEmail, saveOtp.generatedOtp);
                if(response.accepted && response.accepted.length > 0) {
                    return res.json({
                        status: 'success', 
                        msg: 'OTP was sent to your email successfully',
                        generatedOtpNum: saveOtp.generatedOtpNum
                    });
                }
                return res.json({status: 'error', msg: "Couldn't send OTP, Please try again"});
            }
        } else {
            const {email, otp} = req.body;
            // Check if otp matches
            const foundOtp = await OTP.findOne({recipientEmail: email});
            const currDate = moment(Date.now());
            const otpCreatedAt = moment(foundOtp.createdAt);
            const duration = moment.duration(currDate.diff(otpCreatedAt)).asMinutes();

            if(foundOtp.generatedOtp === otp && foundOtp.incorrectAttempts < 3 && Math.round(duration) < 11) {
                const deleteOtpDoc = await OTP.findOneAndDelete({recipientEmail: email});
                if(deleteOtpDoc) return res.json({status: 'success', msg: 'OTP verified 👍'});
            } else if(foundOtp.incorrectAttempts >= 3 || Math.round(duration) >= 11) {
                const updateOtpDoc = await OTP.findOneAndUpdate({recipientEmail: email}, {$set: {
                    generatedOtp: '',
                    incorrectAttempts: 0
                }});
                if(updateOtpDoc) return res.json({status: 'warning', msg: 'Your OTP has expired, please try again.'});
            }
            await OTP.findOneAndUpdate({recipientEmail: email}, {$set: {
                incorrectAttempts: foundOtp.incorrectAttempts + 1
            }});
            return res.json({status: 'error', msg: 'Incorrect OTP 🙁'});
        }
    } catch(err) {
        console.log(err);
        return res.status(500).json({msg: err});
    }
});

module.exports = router;