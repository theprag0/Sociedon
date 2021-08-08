import React, { useContext, useRef, useEffect } from 'react';
import axios from 'axios';
import { Link, Redirect } from 'react-router-dom';
import useInputState from '../../hooks/useInputState';
import { AuthenticationContext } from '../../contexts/auth.context';

function Login(props) {
    // Handle Form Inputs
    const {isAuthenticated, setIsAuthenticated, setStatus, setUserData, setUserLoading, setToken, setMsg} = useContext(AuthenticationContext);
    const [email, setEmail, resetEmail] = useInputState('');
    const [password, setPassword, resetPassword] = useInputState('');

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
        
        axios.post('/api/auth/login', {email, password})
            .then(res => {
                setIsAuthenticated(true);
                setUserLoading(false);
                setStatus(res.status);
                setUserData(res.data.user);
                setToken(res.data.token);
                window.localStorage.setItem('token', res.data.token);
                window.localStorage.setItem('currUserId', res.data.user.id);
                props.history.push({
                    pathname: `/messenger/${res.data.user.id}`,
                    state: {message: `Welcome back ${res.data.user.username}!`, type: 'welcome'}
                });
            })
            .catch(err => {
                console.log(err)
                setIsAuthenticated(false);
                setUserLoading(true);
                setStatus(err.response.status);
                setUserData(null);
                setToken(null);
                setMsg(err.response.data.msg);
            });

        resetEmail();
        resetPassword();
    } 

    return(
        <div>
            <form onSubmit={handleSubmit}>
                <label htmlFor="email">Email</label>
                <input 
                    type="text" 
                    onChange={setEmail} 
                    value={email} 
                    name="email"
                    id="email"
                    placeholder="Enter your email id"
                    required
                />
                <label htmlFor="password">Password</label>
                <input 
                    type="password"
                    onChange={setPassword}
                    value={password}
                    name="password"
                    id="password"
                    placeholder="Enter your password"
                    required
                />
                <button type="submit">Login</button>
            </form>
            <p>
                <em>Not registered yet?</em>
                <strong><Link to='/register'>Sign Up</Link></strong>
            </p>
        </div>
    );
}

export default Login;