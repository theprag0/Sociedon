import React, { useEffect, useContext } from 'react';
import io from 'socket.io-client';
import { SocketContext } from '../../contexts/socket.context';
import { MessengerContext } from '../../contexts/messenger.context';
import Sidebar from './sidebar/Sidebar';
import Notifications from './Notifications';
import Search from './Search';
import { withSnackbar } from '../utility/SnackbarHOC';

function Messenger({history, match, snackbarShowMessage}) {
    const {socket, setSocket} = useContext(SocketContext);
    const {setFriends} = useContext(MessengerContext);

    // Replace redirect history
    useEffect(() => {
        if(history.location.state) {
            snackbarShowMessage(history.location.state.message, 'welcome');
        }
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
                console.log(socket.id);
                socket.on('friendsList', data => setFriends(data.friends));
                socket.on('newOnlineFriend', data => {
                    console.log('new online friend')
                    setFriends(friends => {
                        const updateOnlineFriend = friends.map(f => {
                            if(f._id === data._id) {
                                return {...f, status: 'online'}
                            } else {
                                return f;
                            }
                        });
                        return updateOnlineFriend;
                    });
                });
                socket.on('newOfflineFriend', data => {
                    console.log('new offline friend')
                    setFriends(friends => {
                        const updateOfflineFriend = friends.map(f => {
                            if(f._id === data._id) {
                                return {...f, status: 'offline'}
                            } else {
                                return f;
                            }
                        });
                        return updateOfflineFriend;
                    });
                });
            });
        }
        // Disconnect socket on component unmount
        return () => {
            if(socket !== null) {
                socket.disconnect(true);
            }
        }
    }, [socket, match.params.id]);

    return (
        <section className="Messenger">
            <Sidebar userId={match.params.id}/>
            <div className="Messenger-body">
                <Notifications userId={match.params.id}/>
                <h1>Messenger</h1>
                <Search type="friends"/>
            </div>
        </section>
    );
}

export default withSnackbar(Messenger);