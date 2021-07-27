import React, { useContext } from 'react';
import { withRouter } from 'react-router';
import { AuthenticationContext } from '../../contexts/auth.context';

function Logout(props) {
    const { 
        setIsAuthenticated,  
        setUserLoading,  
        setUserData, 
        setToken
    } = useContext(AuthenticationContext);

    const handleLogout = () => {
        window.localStorage.removeItem('token');
        setIsAuthenticated(false);
        setUserLoading(true);
        setUserData({});
        setToken(null);
        props.history.push('/');
    }

    return (
        <button onClick={handleLogout}>Logout</button>
    )
}

export default withRouter(Logout);
