import React, { useEffect, useRef, useContext, useState } from 'react';
import io from 'socket.io-client';
import { SocketContext } from '../../contexts/socket.context';
import Logout from '../auth/Logout';
import Notifications from './Notifications';
import Search from './Search';
import Alert from '../utility/Alert';

function Messenger({history, match}) {
    const [alert, setAlert] = useState({});
    const {socket, setSocket} = useContext(SocketContext);
    
    const popupMsg = useRef(null);

    // Replace redirect history
    useEffect(() => {
        popupMsg.current = history.location.state ? history.location.state.message : null;
        history.replace({...history.location, state: undefined}); 
    }, [history]);

    // Socket connection
    useEffect(() => {
        // Socket connections
        setSocket(io(`http://localhost:8080?userId=${match.params.id}`));
    }, [match.params.id]);

    // Initial client connection to server main namespace
    useEffect(() => {
        if(socket !== null) {
            socket.on('connect', () => {
                console.log(socket.id)
                socket.emit('currUser', {userId: match.params.id});
            });
        }
    }, [socket, match.params.id]);

    const showAlert = (message, type) => {
        setAlert({message, type});
    }

    return (
        <React.Fragment>
            <Logout />
            <Notifications userId={match.params.id}/>
            {Object.keys(alert).length !== 0 ? <Alert message={alert.message} type={alert.type}/> : ''}
            {popupMsg.current !== null ? <Alert message={popupMsg.current} type="success"/> : null}
            <h1>Messenger</h1>
            <Search type="friends" showAlert={showAlert}/>
            <input type="text" style={{zIndex: -10, position: 'absolute'}}/>
        </React.Fragment>
    );
}

export default Messenger;