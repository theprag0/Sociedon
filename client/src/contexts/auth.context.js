import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthenticationContext = createContext();

export function AuthenticationProvider(props) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userLoading, setUserLoading] = useState(true);
    const [msg, setMsg] = useState('');
    const [status, setStatus] = useState(null);
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(window.localStorage.getItem('token'));

    useEffect(() => {
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };
        if(token) config.headers['x-auth-token'] = token;

        axios.get('/api/auth/user', config)
            .then(res => {
                setIsAuthenticated(true);
                setUserLoading(false);
                setStatus(res.status);
                setUser(res.data)
            })
            .catch(err => {
                setIsAuthenticated(false);
                setUserLoading(true);
                setStatus(err.response.status);
                setMsg(err.response.data.msg);
                setUser(null);
                window.localStorage.removeItem('token');
            });
    }, [token]);

    const payload = {
        isAuthenticated, 
        setIsAuthenticated, 
        userLoading, 
        setUserLoading, 
        msg, 
        setMsg, 
        status, 
        setStatus, 
        user, 
        setUser,
        token, 
        setToken
    };

    return (
        <AuthenticationContext.Provider value={payload}>
            {props.children}
        </AuthenticationContext.Provider>
    )
}