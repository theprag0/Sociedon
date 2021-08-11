import React, { useEffect, useRef, useState, useContext } from 'react';
import axios from 'axios';
import isDate from 'validator/lib/isDate';
import isStrongPassword from 'validator/lib/isStrongPassword';
import { AuthenticationContext } from '../../contexts/auth.context';
import useInputState from '../../hooks/useInputState';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import RegisterForm from './RegisterForm';
import AvatarPicker from '../utility/AvatarPicker';
import { withSnackbar } from '../utility/SnackbarHOC';
import useStyles from '../../styles/RegisterStyles';

function Register(props) {
    const {isAuthenticated, setIsAuthenticated, setStatus, setUserData, setUserLoading, setToken} = useContext(AuthenticationContext);
    // Handle form input change
    const [email, setEmail, resetEmail] = useInputState('');
    const [username, setUsername, resetUsername] = useInputState('');
    const [password, setPassword, resetPassword] = useInputState('', false, 'password');
    const [confirmPassword, setConfirmPassword, resetConfirmPassword] = useInputState('', false, 'password');
    const [month, setMonth, resetMonth] = useInputState('');
    const [day, setDay, resetDay] = useInputState('');
    const [year, setYear, resetYear] = useInputState('');
    const [avatar, setAvatar] = useState('');

    // Check if user is already authenticated and redirect back 
    const existingToken = window.localStorage.getItem('token');
    const existingUserId = window.localStorage.getItem('currUserId');
    if(isAuthenticated && existingToken && existingUserId && existingToken !== undefined && existingUserId !== undefined) {
        props.history.push({
            pathname: `/messenger/${existingUserId}`,
            state: {message: "You're logged in already! 🤨😀", type: 'warning'}
        });
    }

    // Form and validate dob string
    let dob = useRef(null);
    let [validDate, setValidDate] = useState(null);
    useEffect(() => {
        dob.current = `${year}-${month}-${day}`;
        if((year && day && month) !== '') {
            let dateValidator = isDate(dob.current);
            if(dateValidator) {
                setValidDate(true);
            } else {
                setValidDate(false);
            }
        }
    }, [year, day, month]);

    // Check if password is strong
    const [validPassword, setValidPassword] = useState(null);
    useEffect(() => {
        let checkTimeout;
        if(password !== '') {
            checkTimeout = setTimeout(() => {
                let passwordValidator = isStrongPassword(password);
                setValidPassword(passwordValidator);
            }, 600);
        } else {
            setValidPassword(null);
        }
        return () => clearTimeout(checkTimeout);
    }, [password]);

    // Check if confirm password matches password
    const [passwordMatch, setPasswordMatch] = useState(null);
    useEffect(() => {
        let passwordTimeout;
        if(confirmPassword !== '') {
            passwordTimeout = setTimeout(() => {
                if(password === confirmPassword) setPasswordMatch(true);
                else setPasswordMatch(false);
            }, 600);
        } else setPasswordMatch(null);
        return () => clearTimeout(passwordTimeout);
    }, [confirmPassword, password]);

    // Handle Register Submit
    const handleSubmit = e => {
        e.preventDefault();
        const body = {email, username, password, dob: dob.current, avatar};

        axios.post('/api/user/register', body)
            .then(res => {
                setIsAuthenticated(true);
                setUserLoading(false);
                setUserData(res.data.user);
                setStatus(res.status);
                setToken(res.data.token);
                window.localStorage.setItem('token', res.data.token);
                window.localStorage.setItem('currUserId', res.data.user.id);
                props.history.push(`/messenger/${res.data.user.id}`);
            })
            .catch(err => {
                console.log(err);
                setIsAuthenticated(false);
                setUserLoading(true);
                setUserData(null);
                setStatus(err.response.status);
                props.snackbarShowMessage(err.response.data.msg, 'error');
            });

        resetEmail();
        resetUsername();
        resetPassword();
        resetConfirmPassword();
        resetMonth();
        resetDay();
        resetYear();
        setAvatar('');
        setActiveStep(0);
    }

    // Form Progress
    const [activeStep, setActiveStep] = useState(0);
    const steps = ['Sign Up', 'Finish'];
    const classes = useStyles();

    const handleStep = e => {
        e.preventDefault();
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    return(
        <section className={classes.Register}>
            <div className={classes.registerForm}>
                <div className={classes.formHeader}>
                    <p>Sociedon</p>
                    <h1>Main Page</h1>
                </div>
                <hr className={classes.formHr}/>
                <h1>Sign Up</h1>
                <p>
                    {
                        activeStep === 0 
                        ? 'Please, fill up the form below'
                        : 'Choose your avatar'
                    }
                </p>
                <div className={classes.root}>
                    <Stepper activeStep={activeStep}>
                        {steps.map((label, index) => {
                            const stepProps = {};
                            const labelProps = {};
                            return (
                                <Step key={label} {...stepProps}>
                                    <StepLabel
                                        StepIconProps={{classes: {root: classes.icon, active: classes.activeIcon, completed: classes.completedIcon}}} 
                                        {...labelProps}
                                    >
                                        {label}
                                    </StepLabel>
                                </Step>
                            );
                        })}
                    </Stepper>
                </div>
                <form onSubmit={handleSubmit}>
                    {
                        activeStep === 0
                        ? (
                            <RegisterForm 
                                stateFunctions={{
                                    setEmail, 
                                    setUsername,
                                    setPassword,
                                    setConfirmPassword,
                                    setDay,
                                    setMonth,
                                    setYear,
                                    handleStep
                                }}
                                stateData={{
                                    email,
                                    username,
                                    password,
                                    confirmPassword,
                                    month,
                                    day,
                                    year,
                                    validPassword,
                                    passwordMatch,
                                    validDate
                                }}
                            />
                        )
                        : (
                            <AvatarPicker
                                setAvatar={setAvatar} 
                                avatar={avatar}
                                activeStep={activeStep}
                            /> 
                        )
                    }
                    <Button 
                        style={{
                            display: activeStep === 0 ? 'none' : 'block', 
                        }} 
                        type="submit"
                        className={classes.submitBtn}
                        size="small"
                        variant="outlined"
                        disabled={
                            avatar !== ''
                            && validDate 
                            && (email && username && password) !== '' 
                            && validPassword
                            && passwordMatch
                            ? false : true
                        }
                    >
                        SIGN UP
                    </Button>
                </form>
            </div>
            <div className={classes.RegisterFiller}></div>
        </section>
    );
}

export default withSnackbar(Register);