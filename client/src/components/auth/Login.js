import React from 'react';
import { Link } from 'react-router-dom';
import useInputState from '../../hooks/useInputState';

function Login(props) {
    // Handle Form Inputs
    const [username, setUsername, resetUsername] = useInputState('');
    const [password, setPassword, resetPassword] = useInputState('');

    // Handle login form submission
    const handleSubmit = e => {
        e.preventDefault();
        resetUsername();
        resetPassword();
    } 

    return(
        <form onSubmit={handleSubmit}>
            <label htmlFor="username">Email or Username</label>
            <input 
                type="text" 
                onChange={setUsername} 
                value={username} 
                name="username"
                id="username"
                placeholder="Enter username or email"
            />
            <label htmlFor="password">Password</label>
            <input 
                type="password"
                onChange={setPassword}
                value={password}
                name="password"
                id="password"
                placeholder="Enter your password"
            />
            <button type="submit">Login</button>
            <p>
                <em>Not registered yet?</em>
                <strong><Link to='/register'>Sign Up</Link></strong>
            </p>
        </form>
    );
}

export default Login;