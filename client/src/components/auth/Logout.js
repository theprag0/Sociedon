import React, { useContext } from 'react';
import { withRouter } from 'react-router';
import Button from '@material-ui/core/Button';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { makeStyles } from '@material-ui/core/styles';
import { AuthenticationContext } from '../../contexts/auth.context';
import { SocketContext } from '../../contexts/socket.context';

const useStyles = makeStyles((theme) => ({
    btn: {
      padding: theme.spacing(2),
      alignItems: 'center',
      textTransform: 'none'
    },
}));

function Logout(props) {
    const { 
        setIsAuthenticated,  
        setUserLoading,  
        setUserData, 
        setToken
    } = useContext(AuthenticationContext);
    const {socket} = useContext(SocketContext);

    const classes = useStyles();

    const handleLogout = () => {
        window.localStorage.removeItem('token');
        window.localStorage.removeItem('currUserId');
        setIsAuthenticated(false);
        setUserLoading(true);
        setUserData({});
        setToken(null);
        if(socket !== null) socket.disconnect(true);
        props.history.push({
            pathname: '/',
            state: {message: 'Logged you out 👍', type: 'success'}
        });
    }

    return (
        <>
            {
                props.currPage === 'home'
                ? <button onClick={handleLogout} className="logout-btn">Logout</button>
                : <Button 
                    className={classes.btn} 
                    onClick={handleLogout}
                    endIcon={<ExitToAppIcon fontSize="small"/>}
                > 
                    Logout
                </Button>
            }
        </>
    )
}

export default withRouter(Logout);
