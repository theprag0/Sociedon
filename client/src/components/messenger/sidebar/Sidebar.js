import React, { useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthenticationContext } from '../../../contexts/auth.context';
import { SocketContext } from '../../../contexts/socket.context';
import { MessengerContext } from '../../../contexts/messenger.context';
import SidebarPanel from './SidebarPanel';
import FriendsListItem from './FriendsListItem';
import '../../../styles/Sidebar.css';
import findFriends from '../../../assets/images/friends-chat2.png';

function Sidebar({userId}) {
    const {token} = useContext(AuthenticationContext);
    const {socket} = useContext(SocketContext);
    const {chatboxUser, conversations, setConversations, currentBody} = useContext(MessengerContext);

    // Load user's conversations/direct messages
    useEffect(() => {
        const config = {
            headers: {'x-auth-token': token}
        };
        axios.get(`/messenger/retrieve/conversations/${userId}`, config)
            .then(res => {
                if(res.data && res.data.conversations) {
                    setConversations(res.data.conversations);
                }
            })
            .catch(err => console.log(err));
    }, [token, userId]);

    // Update unread messages if chatbox is not open
    useEffect(() => {
        if(socket !== null && (!chatboxUser || Object.keys(chatboxUser).length === 0)) {
            socket.on('private message', data => {
                setConversations(currConvo => {
                    const updateConversations = currConvo.map(c => {
                        if(data.from === c._id) {
                            const unreadMessages = c.unreadMessages ? c.unreadMessages + 1 : 1;
                            return {...c, lastMessageFromFriend: data, unreadMessages};
                        } else {
                            return c;
                        }
                    });
                    return updateConversations;
                });
            });
        }

        return () => {
            if(socket !== null) socket.off('private message');
        }
    }, [socket, currentBody, chatboxUser]);

    return (
        <nav className="Sidebar">
            <SidebarPanel />
            <div className="Sidebar-friends">
                <span>
                    <h1 style={{display: 'inline-block', marginRight: '1rem'}}>Conversations</h1>
                    <i className="fas fa-search sidebar-icon-1"></i>
                </span>
                <div className="friends-list">
                    {
                        (conversations && conversations.length > 0) 
                        ?
                        <ul style={{marginTop: '1rem'}}>
                            {conversations.map(c => (
                                <React.Fragment key={c._id}>
                                    <FriendsListItem 
                                        userId={userId}
                                        userData={c}
                                        selected={(chatboxUser && chatboxUser._id === c._id) ? true : false}
                                    />
                                </React.Fragment>
                            ))}
                        </ul>
                        :
                        (
                            <div className="find-friends">
                                <img className="Sidebar-illustration" src={findFriends} alt="find friends illustration"/>
                                <p style={{textAlign: 'center'}}>
                                    Find friends and start socializing 😃
                                </p>
                            </div>
                        )
                    }
                </div>
            </div>
        </nav>
    )
}

export default Sidebar;