import React, { useContext, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthenticationContext } from '../../contexts/auth.context';
import { withSnackbar } from '../utility/SnackbarHOC';
import useInputState from '../../hooks/useInputState';
import FormGroup from '@material-ui/core/FormGroup';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import useStyles from '../../styles/LoginStyles';
import loginBg from '../../assets/videos/login-bg.mp4';
import loader from '../../assets/svg/transparent-loader.svg';

function Login(props) {
    // Handle Form Inputs
    const {isAuthenticated, setIsAuthenticated, setStatus, setUserData, setUserLoading, setToken, setMsg} = useContext(AuthenticationContext);
    const [email, setEmail, resetEmail] = useInputState('');
    const [password, setPassword, resetPassword] = useInputState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const classes = useStyles();

    // Check if user is already authenticated and redirect back 
    const existingToken = window.localStorage.getItem('token');
    const existingUserId = window.localStorage.getItem('currUserId');
    if(isAuthenticated && existingToken && existingUserId && existingToken !== undefined && existingUserId !== undefined) {
        props.history.push({
            pathname: `/messenger/${existingUserId}`,
            state: {message: "You're logged in already! 🤨😀", type: 'warning'}
        });
    }

    // Handle login form submission
    const handleSubmit = e => {
        e.preventDefault();

        setLoading(true);
        axios.post('/api/auth/login', {email, password})
            .then(res => {
                setIsAuthenticated(true);
                setUserLoading(false);
                setStatus(res.status);
                setUserData(res.data.user);
                setToken(res.data.token);
                setLoading(false);
                window.localStorage.setItem('token', res.data.token);
                window.localStorage.setItem('currUserId', res.data.user.id);
                props.history.push({
                    pathname: `/messenger/${res.data.user.id}`,
                    state: {message: `Welcome back ${res.data.user.username}!`, type: 'welcome'}
                });
            })
            .catch(err => {
                console.log(err)
                props.snackbarShowMessage(err.response.data.msg, 'error');
                setIsAuthenticated(false);
                setUserLoading(true);
                setStatus(err.response.status);
                setUserData(null);
                setToken(null);
                setMsg(err.response.data.msg);
                setLoading(false);
            });

        resetEmail();
        resetPassword();
    } 

    const handleClickShowPassword = e => {
        setShowPassword(currState => !currState);
    };
    
    const handleMouseDownPassword = evt => {
        evt.preventDefault();
    };

    return(
        <section className={classes.Login}>
            <div>
                <video autoPlay loop muted className={classes.loginBg}>
                    <source src={loginBg} type="video/mp4"/>
                </video>
            </div>
            <div className={classes.loginForm}>
                <div className={classes.formHeader}>
                    <p>Sociedon</p>
                    <h1>Main Page</h1>
                </div>
                <hr className={classes.formHr}/>
                <div style={{marginTop: '5rem'}}>
                    <h1>Login</h1>
                    <p>Enter your email and password to login</p>
                    <form onSubmit={handleSubmit}>
                        <FormGroup style={{padding: '0 3rem'}}>
                            <TextField 
                                type="text" 
                                onChange={setEmail} 
                                value={email} 
                                name="email"
                                id="email"
                                placeholder="Enter your email id"
                                variant="outlined"
                                label="Email"
                                InputProps={{
                                    classes: {
                                        root: classes.inputField,
                                        focused: classes.focused,
                                        notchedOutline: classes.notchedOutline
                                    }
                                }}
                                InputLabelProps={{
                                    classes: {
                                        root: classes.label,
                                        focused: classes.focused
                                    }
                                }}
                                autoComplete="off"
                                required
                            />
                            <TextField 
                                type={showPassword ? "text" : "password"}
                                onChange={setPassword}
                                value={password}
                                name="password"
                                id="password"
                                placeholder="Enter your password"
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
                                    classes: {
                                        root: classes.inputField,
                                        focused: classes.focused,
                                        notchedOutline: classes.notchedOutline
                                    }
                                }}
                                InputLabelProps={{
                                    classes: {
                                        root: classes.label,
                                        focused: classes.focused
                                    }
                                }}
                                autoComplete="off"
                                required
                            />
                        </FormGroup>
                        <button type="submit" className={classes.btn}>
                            {
                                !loading
                                ? 'Login'
                                : <img src={loader} alt="loader gif" style={{width: '1.5rem', height: '1.2rem', paddingTop: '4px'}}/>
                            }
                        </button>
                    </form>
                    <p style={{paddingTop: '1.5rem'}}>
                        Don't have an account? 
                        <Link to="/register" style={{
                            fontFamily: "'Montserrat', sans-serif", 
                            color: '#7B4E53', 
                            fontWeight: 600,
                            paddingLeft: '10px',
                            letterSpacing: '1px'
                        }}>
                            SignUp
                        </Link>
                    </p>
                </div>
            </div>
        </section>
    );
}

export default withSnackbar(Login);