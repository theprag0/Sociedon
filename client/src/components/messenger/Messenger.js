import React, { useEffect, useRef, useContext, useState } from 'react';
import io from 'socket.io-client';
import { SocketContext } from '../../contexts/socket.context';
import { MessengerContext } from '../../contexts/messenger.context';
import Sidebar from './sidebar/Sidebar';
import Logout from '../auth/Logout';
import Notifications from './Notifications';
import Search from './Search';
import Alert from '../utility/Alert';

function Messenger({history, match}) {
    const [alert, setAlert] = useState({});
    const {socket, setSocket} = useContext(SocketContext);
    const {setFriends, setOnlineFriends, onlineFriends} = useContext(MessengerContext);
    
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
                socket.on('friendsList', data => setFriends(data.friends));
                socket.on('newOnlineFriend', data => setOnlineFriends([...onlineFriends, data]));
                socket.on('newOfflineFriend', data => {
                    const filterOnlineFriends = onlineFriends.filter(friend => friend._id !== data._id);
                    setOnlineFriends(filterOnlineFriends);
                });
            });
        }
        // Disconnect socket on component unmount
        return () => {
            if(socket !== null) {
                socket.disconnect();
            }
        }
    }, [socket, match.params.id]);

    const showAlert = (message, type) => {
        setAlert({message, type});
    }

    return (
        <section className="Messenger">
            <Sidebar userId={match.params.id}/>
            <div className="Messenger-body">
                <Logout />
                <Notifications userId={match.params.id} showAlert={showAlert}/>
                {Object.keys(alert).length !== 0 ? <Alert message={alert.message} type={alert.type}/> : ''}
                {popupMsg.current !== null ? <Alert message={popupMsg.current} type="success"/> : null}
                <h1>Messenger</h1>
                <Search type="friends" showAlert={showAlert}/>
            </div>
        </section>
    );
}

export default Messenger;