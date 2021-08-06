import React, { useContext, useRef } from 'react';
import axios from 'axios';
import moment from 'moment';
import { AuthenticationContext } from '../../../contexts/auth.context';
import { MessengerContext } from '../../../contexts/messenger.context';
import groupMessagesByDate from '../../../helpers/groupMessagesByDate';
import getDefaultPicture from '../../../helpers/getDefaultPicture';

function FriendsListItem({userData, selected, userId}) {
    const {setCurrentBody, setChatboxUser, setChatboxLoading} = useContext(MessengerContext);
    const {token} = useContext(AuthenticationContext);

    const handleClick = e => {
        setCurrentBody('chatbox');
        setChatboxLoading(true);
        // Load initial message data
        const config = {
            headers: {'x-auth-token': token}
        };
        axios.post('/messenger/messages', {
            type: 'dm',
            userA: userId,
            userB: userData._id
        }, config).then(res => {
            if(res.data.messages && res.data.messages.length > 0) {
                const messages = groupMessagesByDate(res.data.messages);
                setChatboxUser({...userData, messages});
            } else {
                setChatboxUser({...userData, messages: {}});
            }
            setChatboxLoading(false);
        }).catch(err => console.log(err));
    }
    
    const lastMessageTimestamp = useRef(null);
    lastMessageTimestamp.current = (
        userData.lastMessageFromFriend ? moment(userData.lastMessageFromFriend.timestamp).fromNow() : ''
    );

    return (
        <li className={`FriendsListItem ${selected ? 'selected' : ''}`} onClick={handleClick}>
            <div className="img-container">
                <img 
                    className="user-avatar" 
                    src={userData.defaultImage ? getDefaultPicture(userData.defaultImage) : userData.image}
                    alt="user avatar"
                />
                <p className={userData.status === 'online' ? 'online' : 'offline'}></p>
            </div>
            <div className="friend-info">
                <span>
                    {userData.username}
                    <p>
                        {
                            lastMessageTimestamp.current === 'a few seconds ago' 
                            ? 'now' 
                            : lastMessageTimestamp.current
                        }
                    </p>
                </span>
                <span className="recent-message" style={{display: userData.unreadMessages ? 'flex' : 'none'}}>
                    <p>{userData.lastMessageFromFriend ? userData.lastMessageFromFriend.message : ''}</p>
                    <p className={userData.unreadMessages && userData.unreadMessages > 15 ? 'exceeded-unseen' : ''}>
                        {
                            userData.unreadMessages 
                            ? (userData.unreadMessages > 15 ? '15+' : userData.unreadMessages)
                            : ''
                        }
                    </p>
                </span>
            </div>
        </li>
    );
}

export default FriendsListItem;