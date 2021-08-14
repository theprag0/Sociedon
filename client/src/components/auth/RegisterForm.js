import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Grid from '@material-ui/core/Grid';
import FormGroup from '@material-ui/core/FormGroup';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import InputAdornment from '@material-ui/core/InputAdornment';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import InputLabel from '@material-ui/core/InputLabel';
import useStyles from '../../styles/RegisterStyles';
import loader from '../../assets/svg/transparent-loader.svg';

function RegisterForm({stateFunctions, stateData, snackbarShowMessage}) {
    const {
        setEmail, 
        setUsername,
        setPassword,
        setConfirmPassword,
        setDay,
        setMonth,
        setYear,
        handleStep
    } = stateFunctions;
    const {
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
    } = stateData;
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [submittingForm, setSubmittingForm] = useState(false);
    const classes = useStyles();

    // Date of birth data
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const curYear = (new Date()).getFullYear();
    const years = Array.from(new Array(100),( val, index) => curYear - index);
    const days = [];
    for(let i = 1; i <= 31; i++) {
        days.push(<MenuItem key={i} value={i < 10 ? `0${i}` : i}>{i}</MenuItem>);
    }

    const handleClickShowPassword = e => {
        if(e.currentTarget.title === 'password') {
            setShowPassword(currState => !currState);
        } else {
            setShowConfirmPassword(currState => !currState);
        }
    };
    
    const handleMouseDownPassword = evt => {
        evt.preventDefault();
    };

    // Handle form submission
    const handleClick = e => {
        e.preventDefault();
        setSubmittingForm(true);
        axios.post('/api/user/register/verify', {email, type: 'generateOtp'})
            .then(res => {
                handleStep();
                setSubmittingForm(false);
                snackbarShowMessage(res.data.msg, 'success');
            }).catch(err => console.log(err));
    }

    return (
        <FormGroup className={classes.registerFormGroup}>
            <TextField 
                type="email"
                onChange={setEmail}
                value={email}
                name="email"
                id="email"
                placeholder="Eg: test@xyz.com"
                variant="outlined"
                label="Email"
                autoComplete="off"
                InputProps={{
                    classes: {
                        root: classes.inputField,
                    },
                    style: {marginBottom: validEmail || validEmail === null ? '1.3rem' : '0'}
                }}
                size="small"
                helperText={
                    validEmail || validEmail === null 
                    ? "" 
                    : "Please enter a valid email address"
                }
                FormHelperTextProps={{
                    style: {padding: 0, marginBottom: '1rem'}
                }}
                error={validEmail || validEmail === null ? false : true}
                required
            />
            <TextField 
                type="text"
                onChange={setUsername}
                value={username}
                name="username"
                id="username"
                placeholder="Enter Username"
                variant="outlined"
                label="Username"
                autoComplete="off"
                InputProps={{
                    classes: {
                        root: classes.inputField,
                    },
                }}
                size="small"
                required
            />
            <TextField 
                type={showPassword ? "text" : "password"}
                onChange={setPassword}
                value={password}
                name="password"
                id="password"
                placeholder="Enter Password"
                variant="outlined"
                label="Password"
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                title="password"
                                edge="end"
                                size="small"
                            >
                                {showPassword ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                        </InputAdornment>
                    ),
                    startAdornment: (
                        <InputAdornment position="start">
                            <Tooltip
                                placement="top-start"
                                title={
                                    <div className={classes.passwordInfo}>
                                        <p>Password must include the following:</p>
                                        <ul>
                                            <li>Minimum: 8 characters</li>
                                            <li>Must include atleast one UPPERCASE character</li>
                                            <li>Must include atleast one special character(Eg: @,$..)</li>
                                            <li>Must include atleast one numerical character</li>
                                        </ul>
                                    </div>
                                }
                                arrow
                            >
                                <InfoIcon style={{fontSize: '1rem', color: '#f95959', cursor: 'pointer'}}/>
                            </Tooltip>
                        </InputAdornment>
                    ),
                    classes: {
                        root: classes.validateField,
                    },
                    style: {marginBottom: validPassword || validPassword === null ? '1.3rem' : '0'}
                }}
                FormHelperTextProps={{
                    style: {padding: 0, marginBottom: '1.3rem'}
                }}
                size="small"
                helperText={
                    validPassword || validPassword === null 
                    ? "" 
                    : "Please enter a strong password"
                }
                error={validPassword || validPassword === null ? false : true}
                required
            />
            <TextField 
                type={showConfirmPassword ? "text" : "password"}
                onChange={setConfirmPassword}
                value={confirmPassword}
                name="confirm-password"
                id="confirm-password"
                placeholder="Confirm Password"
                variant="outlined"
                label="Confirm Password"
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                title="confirm-password"
                                edge="end"
                                size="small"
                            >
                                {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                        </InputAdornment>
                    ),
                    classes: {
                        root: classes.inputField,
                    },
                    style: {marginBottom: passwordMatch || passwordMatch === null ? '1.3rem' : '0'}
                }}
                FormHelperTextProps={{
                    style: {padding: 0, marginBottom: '1rem'}
                }}
                size="small"
                helperText={passwordMatch || passwordMatch === null ? '' : 'Password does not match'}
                error={passwordMatch || passwordMatch === null ? false : true}
                required
            />
            <InputLabel style={{marginBottom: '10px'}} htmlFor="dob">Date Of Birth *</InputLabel>
            <Grid>
                <TextField 
                    name="month" 
                    id="month" 
                    onChange={setMonth} 
                    value={month} 
                    label="Month"
                    variant="outlined"
                    InputProps={{
                        classes: {
                            root: classes.selectField,
                        },
                    }}
                    size="small"
                    style={{width: '30%'}}
                    select
                >
                    <MenuItem disabled>Month</MenuItem>
                    {months.map((month, i) => (
                        <MenuItem key={i} value={i < 9 ? `0${i + 1}` : i + 1}>{month}</MenuItem>
                    ))}
                </TextField>
                <TextField 
                    name="day" 
                    id="day" 
                    onChange={setDay}
                    value={day}
                    variant="outlined"
                    label="Day" 
                    InputProps={{
                        classes: {
                            root: classes.selectField,
                        },
                    }}
                    style={{width: '30%'}}
                    size="small"
                    select
                >
                    <MenuItem disabled>Day</MenuItem>
                    {days}
                </TextField>
                <TextField 
                    name="year" 
                    id="year" 
                    onChange={setYear}
                    value={year}
                    variant="outlined"
                    label="Year"
                    InputProps={{
                        classes: {
                            root: classes.selectField,
                        },
                    }}
                    style={{width: '30%'}}
                    size="small"
                    select
                >
                    <MenuItem disabled>Year</MenuItem>
                    {years.map(y => (
                        <MenuItem key={y} value={y}>{y}</MenuItem>
                    ))}
                </TextField>
            </Grid>
            <p style={{color: '#f44336', fontSize: '0.75rem', padding: 0, paddingLeft: '1rem'}}>
                {(!validDate && validDate !== null) ? 'Choose a valid date' : ''}
            </p>
            <button 
                type="button" 
                onClick={handleClick}
                disabled={
                    validDate 
                    && (email && username && password) !== '' 
                    && validEmail
                    && validPassword
                    && passwordMatch
                    ? false 
                    : true
                }
                className={classes.btn}
            >
                {
                    !submittingForm
                    ? 'Continue'
                    : <img src={loader} alt="loader gif" style={{width: '1.5rem', height: '1.2rem', paddingTop: '4px'}}/>
                }
            </button>
            <p style={{padding: 0, paddingTop: '10px'}}>
                Already have an account? 
                <Link to="/login" style={{
                    fontFamily: "'Montserrat', sans-serif", 
                    color: '#f95959', 
                    fontWeight: 600,
                    paddingLeft: '10px',
                    letterSpacing: '1px'
                }}>
                    Login
                </Link>
            </p>
        </FormGroup>
    );
}

export default RegisterForm;