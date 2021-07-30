import React from 'react';
import getDefaultPicture from '../../../helpers/getDefaultPicture';

function FriendsListItem({userData}) {
    return (
        <li className="FriendsListItem">
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