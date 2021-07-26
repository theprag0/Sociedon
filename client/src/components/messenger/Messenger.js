import React, { useEffect, useRef, useContext, useState } from 'react';
import io from 'socket.io-client';
import { AuthenticationContext } from '../../contexts/auth.context';
import Logout from '../auth/Logout';
import Search from './Search';
import Alert from '../utility/Alert';

function Messenger({history, match}) {
    const [alert, setAlert] = useState({});
    const {isAuthenticated} = useContext(AuthenticationContext);
    
    const popupMsg = useRef(null);

    // Replace redirect history
    useEffect(() => {
        popupMsg.current = history.location.state ? history.location.state.message : null;
        history.replace({...history.location, state: undefined}); 
    }, [history]);

    // Socket connection
    useEffect(() => {
        // Socket connections
        const socket = io('http://localhost:8080');
        socket.on('connect', () => {
            console.log(socket.id)
            socket.emit('currUser', {userId: match.params.id});
        });
    }, [match.params.id]);

    const showAlert = (message, type) => {
        setAlert({message, type});
    }

    return (
        <div className="Messenger">
            <Logout />
            {Object.keys(alert).length !== 0 ? <Alert message={alert.message} type={alert.type}/> : ''}
            {popupMsg.current !== null ? <Alert message={popupMsg.current} type="success"/> : null}
            <h1>Messenger</h1>
            <Search type="friends" showAlert={showAlert}/>
            <input type="text" style={{zIndex: -10, position: 'absolute'}}/>
        </div>
    );
}

export default Messenger;