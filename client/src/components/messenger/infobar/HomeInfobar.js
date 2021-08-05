import React from 'react';
import Search from '../Search';
import FriendsListItem from '../sidebar/FriendsListItem';
import getDefaultPicture from '../../../helpers/getDefaultPicture';

function HomeInfobar({userData, userId, friends}) {
    return (
        <>
            <img src={userData && userData.defaultImage ? getDefaultPicture(userData.defaultImage) : ''} className="Infobar-profile-pic"/>
            <div className="Infobar-search">
                <h1>Find new friends</h1>
                <Search type="friends"/>
            </div>
            <hr className="Infobar-hr"/>
            <div className="Infobar-friends" style={{height: '60%'}}>
                <h1>Friends</h1>
                <ul className="Infobar-friends-list">
                    {
                        (friends && friends.length > 0) ?
                        friends.map(f => (
                            <FriendsListItem 
                                key={f._id}
                                userId={userId}
                                userData={f}
                            />
                        )) : ''
                    }
                </ul>
            </div>
        </>
    )
}

export default HomeInfobar;