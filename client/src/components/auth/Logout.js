import React, { useContext } from 'react';
import { withRouter } from 'react-router';
import { AuthenticationContext } from '../../contexts/auth.context';
import { SocketContext } from '../../contexts/socket.context';

function Logout(props) {
    const { 
        setIsAuthenticated,  
        setUserLoading,  
        setUserData, 
        setToken
    } = useContext(AuthenticationContext);
    const {socket} = useContext(SocketContext);

    const handleLogout = () => {
        window.localStorage.removeItem('token');
        setIsAuthenticated(false);
        setUserLoading(true);
        setUserData({});
        setToken(null);
        socket.disconnect();
        props.history.push('/');
    }

    return (
        <button onClick={handleLogout}>Logout</button>
    )
}

export default withRouter(Logout);
