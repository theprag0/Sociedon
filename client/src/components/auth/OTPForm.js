import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import OtpInput from 'react-otp-input';
import Slide from '@material-ui/core/Slide';
import useStyles from '../../styles/RegisterStyles';
import loader from '../../assets/svg/transparent-loader.svg';

function OTPForm({stateData, handleStep, snackbarShowMessage, setEmailVerified, activeStep}) {
    const [otp, setOtp] = useState('');
    const [verifyingOtp, setVerifyingOtp] = useState(false);
    const [counter, setCounter] = useState(120);
    const [generatedOtpNum, setgeneratedOtpNum] = useState(1);
    const {email} = stateData;
    const classes = useStyles();

    useEffect(() => {
        let timer = counter > 0 && setInterval(() => setCounter(currCounter => currCounter - 1), 1000);
        if(counter === 0) clearInterval(timer);
        return () => clearInterval(timer);
    }, [counter]);

    const handleClick = e => {
        e.preventDefault();
        setVerifyingOtp(true);
        axios.post('/api/user/register/verify', {email, otp, type: 'verifyOtp'})
            .then(res => {
                setVerifyingOtp(false);
                if(res.data.status === 'success') {
                    setEmailVerified(true);
                    snackbarShowMessage(res.data.msg, res.data.status);
                    handleStep();
                } else {
                    snackbarShowMessage(res.data.msg, res.data.status);
                }
            }).catch(err => console.log(err));
    }

    const handleResend = e => {
        e.preventDefault();
        if(generatedOtpNum < 3) setCounter(120);
        if(counter === 0) {
            axios.post('/api/user/register/verify', {email, type: 'generateOtp'})
                .then(res => {
                    if(res.data.generatedOtpNum) setgeneratedOtpNum(res.data.generatedOtpNum);
                    snackbarShowMessage(res.data.msg, res.data.status);
                }).catch(err => console.log(err));
        } else {
            snackbarShowMessage("Can't resend OTP now", 'warning');
        }
    }

    return (
        <Slide direction="right" in={activeStep === 1} timeout={600}>
            <div className={classes.otpForm}>
                <OtpInput 
                    value={otp}
                    onChange={setOtp}
                    numInputs={6}
                    separator={<hr width="14rem" style={{margin: '0 auto'}}/>}
                    isInputNum
                    inputStyle={{
                        height: '3rem', 
                        width: '2.5rem', 
                        border: '1px solid #b6b6b8',
                        borderRadius: '12px'
                    }}
                    focusStyle={{outline: 'none'}}
                    className={classes.otpInput}
                />
                <p>
                    <button disabled={counter > 0} onClick={handleResend}>Resend OTP</button>
                    {moment.utc(counter * 1000).format('mm:ss')}
                </p>
                <button 
                    type="button" 
                    onClick={handleClick}
                    disabled={
                        otp !== '' && otp.length === 6
                        ? false 
                        : true
                    }
                    className={classes.btn}
                >
                    {
                        !verifyingOtp
                        ? 'Verify'
                        : <img src={loader} alt="loader gif" style={{width: '1.5rem', height: '1.2rem', paddingTop: '4px'}}/>
                    }
                </button>
                <ul className={classes.otpInfo}>
                    <li style={{listStyle: 'none'}}><i className="fas fa-info-circle"></i> Note:</li>
                    <li>Please check the spam folder of your email service before resending OTP.</li>
                    <li>You can resend OTP upto 3 times a day.</li>
                    <li>Your OTP will expire after 10 minutes or 3 incorrect attempts.</li>
                </ul>
            </div>
        </Slide>
    );
}

export default OTPForm;