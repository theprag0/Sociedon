import React, { useContext } from 'react';
import { MessengerContext } from '../../../contexts/messenger.context';
import getDefaultPicture from '../../../helpers/getDefaultPicture';

function FriendsListItem({userData, selected}) {
    const {setCurrentBody, setChatboxUser} = useContext(MessengerContext);

    const handleClick = e => {
        setCurrentBody('chatbox');
        setChatboxUser(userData);
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
            {userData.username}
        </li>
    );
}

export default FriendsListItem;