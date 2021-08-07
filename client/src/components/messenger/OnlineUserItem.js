import React, { useContext } from 'react';
import axios from 'axios';
import { MessengerContext } from '../../contexts/messenger.context';
import { AuthenticationContext } from '../../contexts/auth.context';
import groupMessagesByDate from '../../helpers/groupMessagesByDate';
import getDefaultPicture from '../../helpers/getDefaultPicture';

function OnlineUserItem({userData, userId}) {
    const {token} = useContext(AuthenticationContext);
    const {setCurrentBody, setChatboxUser, setChatboxLoading} = useContext(MessengerContext);

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
            userB: userData._id,
            startDate: new Date()
        }, config).then(res => {
            if(res.data.messages && res.data.messages.length > 0) {
                const messages = groupMessagesByDate(res.data.messages);
                const lastDateLoaded = Object.keys(messages)[0];
                setChatboxUser({
                    ...userData, 
                    messages, 
                    lastDateLoaded,
                    unloadedMsgAvailable: res.data.unloadedMsgAvailable
                });
            } else {
                setChatboxUser({...userData, messages: {}});
            }
            setChatboxLoading(false);
        }).catch(err => console.log(err));
    }

    return (
        <li className='FriendsListItem' onClick={handleClick}>
            <div className="img-container">
                <img 
                    className="user-avatar" 
                    src={userData.defaultImage ? getDefaultPicture(userData.defaultImage) : userData.image}
                    alt="user avatar"
                />
                <p className={userData.status === 'online' ? 'online' : 'offline'}></p>
            </div>
            <p>{userData.username}</p>
        </li>
    );
}

export default OnlineUserItem;