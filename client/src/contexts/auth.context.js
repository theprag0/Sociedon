import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthenticationContext = createContext();

export function AuthenticationProvider(props) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userLoading, setUserLoading] = useState(true);
    const [msg, setMsg] = useState('');
    const [status, setStatus] = useState(null);
    const [userData, setUserData] = useState({});
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
                setUserData(res.data)
            })
            .catch(err => {
                console.log(err)
                setIsAuthenticated(false);
                setUserLoading(false);
                setStatus(err.response.status);
                setMsg(err.response.data.msg);
                setUserData(null);
                window.localStorage.removeItem('token');
                window.localStorage.removeItem('currUserId');
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
        userData, 
        setUserData,
        token, 
        setToken
    };

    return (
        <AuthenticationContext.Provider value={payload}>
            {props.children}
        </AuthenticationContext.Provider>
    )
}