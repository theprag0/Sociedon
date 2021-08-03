import React, { useContext } from 'react';
import axios from 'axios';
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
            <p className="friend-info">
                {userData.username} <br />
                <span className="recent-message">{userData.lastMessage ? userData.lastMessage.message : ''}</span>
            </p>
        </li>
    );
}

export default FriendsListItem;