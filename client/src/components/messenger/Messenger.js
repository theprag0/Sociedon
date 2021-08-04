import React, { useEffect, useContext, useRef, useState } from 'react';
import io from 'socket.io-client';
import { SocketContext } from '../../contexts/socket.context';
import { MessengerContext } from '../../contexts/messenger.context';
import Sidebar from './sidebar/Sidebar';
import Chatbox from './Chatbox';
import Infobar from './infobar/Infobar';
import Notifications from './Notifications';
import Search from './Search';
import { withSnackbar } from '../utility/SnackbarHOC';

function Messenger({history, match, snackbarShowMessage}) {
    const {socket, setSocket} = useContext(SocketContext);
    const {setFriends, currentBody, setChatboxUser, chatboxUser, setConversations} = useContext(MessengerContext);

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

    // Set messenger body based on state
    let messengerBody;
    if(currentBody === 'home') {
        messengerBody = (
            <>
                <h1>Messenger</h1>
                <Search type="friends"/>
            </>
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
            <Sidebar userId={match.params.id}/>
            <div className="Messenger-body">
                {messengerBody}
            </div>
            <div className="infobar" style={{width: '25%', height: '100vh', float: 'right'}}>
                <Notifications userId={match.params.id}/>
                <Infobar userId={match.params.id}/>
            </div>
        </section>
    );
}

export default withSnackbar(Messenger);