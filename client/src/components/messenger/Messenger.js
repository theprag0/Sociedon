import React, { useEffect, useContext, useRef, useState } from 'react';
import io from 'socket.io-client';
import { SocketContext } from '../../contexts/socket.context';
import { MessengerContext } from '../../contexts/messenger.context';
import Sidebar from './sidebar/Sidebar';
import MessengerHome from './MessengerHome';
import Chatbox from './Chatbox';
import Infobar from './infobar/Infobar';
import Notifications from './Notifications';
import GlobalNotification from '../utility/GlobalNotification';
import { withSnackbar } from '../utility/SnackbarHOC';

function Messenger({history, match, snackbarShowMessage}) {
    const {socket, setSocket} = useContext(SocketContext);
    const {setFriends, currentBody, setChatboxUser, chatboxUser, setConversations} = useContext(MessengerContext);
    const [showGlobalNotif, setShowGlobalNotif] = useState(true);

    // Replace redirect history
    useEffect(() => {
        if(history.location.state && history.location.state.type === 'welcome') {
            snackbarShowMessage(history.location.state.message, 'welcome');
        } else if(history.location.state && history.location.state.type === 'warning') {
            snackbarShowMessage(history.location.state.message, 'warning');
        }
        history.replace({...history.location, state: undefined}); 
    }, [history]);

    // Socket connection
    useEffect(() => {
        // Socket connections
        setSocket(io(`https://sociedon.herokuapp.com/?userId=${match.params.id}`));
    }, [match.params.id]);

    const chatboxUserId = useRef(null);
    useEffect(() => {
        chatboxUserId.current = chatboxUser._id;
    });

    // Initial client connection to server main namespace
    useEffect(() => {
        if(socket !== null) {
            socket.on('connect', () => {
                console.log(socket.id);
                socket.on('friendsList', data => setFriends(data.friends));
                socket.on('newOnlineFriend', data => {
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
                    setConversations(currConvo => {
                        const updateConversations = currConvo.map(c => {
                            if(c._id === data._id) {
                                return {...c, status: 'online'}
                            } else {
                                return c;
                            }
                        });
                        return updateConversations;
                    })
                    if(chatboxUserId && chatboxUserId.current === data._id) {
                        setChatboxUser(currChatboxUser => ({...currChatboxUser, status: 'online'}));
                    }
                });
                socket.on('newOfflineFriend', data => {
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
                    setConversations(currConvo => {
                        const updateConversations = currConvo.map(c => {
                            if(c._id === data._id) {
                                return {...c, status: 'offline'}
                            } else {
                                return c;
                            }
                        });
                        return updateConversations;
                    })
                    if(chatboxUserId && chatboxUserId.current === data._id) {
                        setChatboxUser(currChatboxUser => ({...currChatboxUser, status: 'offline'}));
                    }
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

    // Show GlobalNotification
    useEffect(() => {
        const globalNotifMetaData = JSON.parse(window.localStorage.getItem('global-notif'));
    
        if(!globalNotifMetaData) {
            setShowGlobalNotif(true);
            window.localStorage.setItem('global-notif', JSON.stringify({notifId: 'v1', notifSeen: false}));
        } else if(globalNotifMetaData && globalNotifMetaData.notifSeen) {
            setShowGlobalNotif(false);
        }
    }, []);
    const handleGlobalNotif = e => {
        if(e.currentTarget.title === 'info-icon') {
            setShowGlobalNotif(true);
        } else {
            setShowGlobalNotif(false);
            window.localStorage.setItem('global-notif', JSON.stringify({notifId: 'v1', notifSeen: true}));
        }
    }

    // Set messenger body based on state
    let messengerBody;
    if(currentBody === 'home') {
        messengerBody = (
            <MessengerHome 
                userId={match.params.id}
            />
        )
    } else if(currentBody === 'chatbox') {
        messengerBody = (
            <Chatbox 
                userId={match.params.id} 
            />
        );
    }

    return (
        <section className="Messenger">
            {
                showGlobalNotif
                ? <GlobalNotification 
                    showGlobalNotif={showGlobalNotif}
                    handleGlobalNotif={handleGlobalNotif}
                />
                : null
            }
            <Sidebar userId={match.params.id}/>
            <div className="Messenger-body">
                {messengerBody}
            </div>
            <div className="infobar" style={{width: '25%', height: '100vh', float: 'right'}}>
                <div style={{height: '15%'}}>
                    <Notifications userId={match.params.id}/>
                </div>
                <Infobar 
                    userId={match.params.id}
                    handleGlobalNotif={handleGlobalNotif}
                />
            </div>
        </section>
    );
}

export default withSnackbar(Messenger);
