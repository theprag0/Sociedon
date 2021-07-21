import React, { useContext } from 'react';
import { withRouter } from 'react-router';
import { AuthenticationContext } from '../../contexts/auth.context';

function Logout(props) {
    const { 
        setIsAuthenticated,  
        setUserLoading,  
        setUser, 
        setToken
    } = useContext(AuthenticationContext);

    const handleLogout = () => {
        window.localStorage.removeItem('token');
        setIsAuthenticated(false);
        setUserLoading(true);
        setUser(null);
        setToken(null);
        props.history.push('/');
    }

    return (
        <button onClick={handleLogout}>Logout</button>
    )
}

export default withRouter(Logout);
