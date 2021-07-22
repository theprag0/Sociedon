import React, { useEffect, useRef, useContext } from 'react';
import io from 'socket.io-client';
import Logout from '../auth/Logout';
import Alert from '../utility/Alert';
import { AuthenticationContext } from '../../contexts/auth.context';

function Messenger({history, match}) {
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
    }, []);

    return (
        <div>
            <Logout />
            {popupMsg.current !== null ? <Alert message={popupMsg.current} type="success"/> : null}
            <h1>Messenger</h1>
        </div>
    );
}

export default Messenger;