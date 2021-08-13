import React, { useEffect, useRef, useState, useContext } from 'react';
import axios from 'axios';
import isDate from 'validator/lib/isDate';
import isStrongPassword from 'validator/lib/isStrongPassword';
import isEmail from 'validator/lib/isEmail';
import { AuthenticationContext } from '../../contexts/auth.context';
import useInputState from '../../hooks/useInputState';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import MobileStepper from '@material-ui/core/MobileStepper';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Slide from '@material-ui/core/Slide';
import RegisterForm from './RegisterForm';
import OTPForm from './OTPForm';
import AvatarPicker from '../utility/AvatarPicker';
import { withSnackbar } from '../utility/SnackbarHOC';
import useStyles from '../../styles/RegisterStyles';
import fillerText from '../../helpers/getFillerText';
import loader from '../../assets/svg/transparent-loader.svg';
import icon1 from '../../assets/images/icon1.jpg';

function Register(props) {
    const {isAuthenticated, setIsAuthenticated, setStatus, setUserData, userLoading, setUserLoading, setToken} = useContext(AuthenticationContext);
    // Handle form input change
    const [email, setEmail, resetEmail] = useInputState('');
    const [username, setUsername, resetUsername] = useInputState('');
    const [password, setPassword, resetPassword] = useInputState('', false, 'password');
    const [confirmPassword, setConfirmPassword, resetConfirmPassword] = useInputState('', false, 'password');
    const [month, setMonth, resetMonth] = useInputState('');
    const [day, setDay, resetDay] = useInputState('');
    const [year, setYear, resetYear] = useInputState('');
    const [avatar, setAvatar] = useState('');
    const [encodedAvatar, setEncodedAvatar] = useState({});
    const [emailVerified, setEmailVerified] = useState(false);

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

    // Check if user input is an email
    const [validEmail, setValidEmail] = useState(null);
    useEffect(() => {
        let emailCheckTimeout;
        if(email !== '') {
            emailCheckTimeout = setTimeout(() => {
                let emailValidator = isEmail(email);
                setValidEmail(emailValidator);
            }, 600);
        } else {
            setValidEmail(null)
        }
        return () => clearTimeout(emailCheckTimeout);
    }, [email])

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
        const body = {email, username, password, dob: dob.current};
        if(avatar !== ''){
            body['avatar'] = avatar;
            body['avatarType'] = 'defaultAvatar';
        } else {
            body['avatar'] = encodedAvatar.avatarUrl;
            body['avatarType'] = 'customAvatar';
        }

        setUserLoading(true);
        axios.post('/api/user/register', body)
            .then(res => {
                setIsAuthenticated(true);
                setUserLoading(false);
                setUserData(res.data.user);
                setStatus(res.status);
                setToken(res.data.token);
                window.localStorage.setItem('token', res.data.token);
                window.localStorage.setItem('currUserId', res.data.user.id);
                props.history.push({
                    pathname: `/messenger/${res.data.user.id}`,
                    state: {message: `Welcome ${res.data.user.username}!`, type: 'welcome'}
                });
            })
            .catch(err => {
                console.log(err);
                setIsAuthenticated(false);
                setUserLoading(false);
                setUserData(null);
                setStatus(err.response.status);
                setActiveStep(0);
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
        setEncodedAvatar({});
    }

    // Form Progress
    const [activeStep, setActiveStep] = useState(0);
    const steps = ['Sign Up', 'Verify', 'Finish'];
    const classes = useStyles();

    const handleStep = e => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    // Filler Mobile-Stepper
    const [activeFillerStep, setActiveFillerStep] = useState(0);
    const handleFillerStep = e => {
        setActiveFillerStep(prevActiveStep => {
            if(prevActiveStep === 4) {
                return 0;
            }
            return prevActiveStep + 1;
        });
    }
    useEffect(() => {
        let stepperTimer = setInterval(() => {
            handleFillerStep();
        }, 6000);

        return () => clearInterval(stepperTimer);
    }, []);

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
                        : activeStep === 1
                            ? 'Verify your email'
                            : 'Choose your avatar'
                    }
                </p>
                <div className={classes.stepperRoot}>
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
                                    validEmail,
                                    validPassword,
                                    passwordMatch,
                                    validDate
                                }}
                                snackbarShowMessage={props.snackbarShowMessage}
                            />
                        )
                        : activeStep === 1 
                            ? (
                                <OTPForm 
                                    stateData={{email}}
                                    handleStep={handleStep}
                                    snackbarShowMessage={props.snackbarShowMessage}
                                    setEmailVerified={setEmailVerified}
                                    activeStep={activeStep}
                                />
                            )
                            : (
                                <AvatarPicker
                                    setAvatar={setAvatar} 
                                    setEncodedAvatar={setEncodedAvatar}
                                    avatar={avatar}
                                    encodedAvatar={encodedAvatar}
                                    activeStep={activeStep}
                                /> 
                            )
                    }
                    <Button 
                        style={{
                            display: activeStep === 0 || activeStep === 1 ? 'none' : 'block', 
                            backgroundColor: userLoading ? '#4849a1' : '',
                            marginTop: encodedAvatar && encodedAvatar.avatarFileName !== '' ? '0.5rem' : '0.9rem'
                        }} 
                        type="submit"
                        className={classes.submitBtn}
                        size="small"
                        variant="outlined"
                        disabled={
                            (avatar !== '' || encodedAvatar.avatarUrl !== '')
                            && validDate 
                            && (email && username && password) !== '' 
                            && validEmail
                            && validPassword
                            && passwordMatch
                            && emailVerified
                            ? false : true
                        }
                    >
                        {
                            !userLoading 
                            ? 'SIGN UP'
                            : <img src={loader} alt="loader gif" style={{width: '1.5rem', height: '1.2rem', paddingTop: '4px'}}/>
                        }
                    </Button>
                </form>
            </div>
            <div className={classes.RegisterFiller}>
                <Slide in={true} direction="up" timeout={500}>
                    <Paper elevation={3} className={classes.infoPaper}>
                        <div className={classes.fillerIcon}>
                            <img src={icon1} alt="filler icon"/>
                        </div>
                        <div className={classes.fillerText}>
                            <div>
                                <h1>{fillerText[activeFillerStep].title}</h1>
                                <p>{fillerText[activeFillerStep].text}</p>
                            </div>
                            <MobileStepper
                                steps={5} 
                                activeStep={activeFillerStep}
                                variant="dots"
                                position="static"
                                className={classes.fillerStepper}
                            />
                        </div>
                    </Paper>
                </Slide>
            </div>
        </section>
    );
}

export default withSnackbar(Register);