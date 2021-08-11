import React from 'react';
import Search from '../Search';
import FriendsListItem from '../sidebar/FriendsListItem';
import { getAvatar } from '../../../helpers/getAvatar';
import friendsIllustration from '../../../assets/svg/friends-illus.svg';

function HomeInfobar({userData, userId, friends}) {
    return (
        <>
            <img 
                src={userData && userData.avatar ? getAvatar(userData.avatar) : ''} 
                className="Infobar-profile-pic"
                alt="user profile pic"
            />
            <div className="Infobar-search">
                <h1>Find new friends</h1>
                <Search type="friends"/>
            </div>
            <hr className="Infobar-hr"/>
            <div className="Infobar-friends" style={{height: '60%'}}>
                <h1>Friends</h1>
                {
                    (friends && friends.length > 0) ?
                    <ul className="Infobar-friends-list">
                        {
                            friends.map(f => (
                                <FriendsListItem 
                                    key={f._id}
                                    userId={userId}
                                    userData={f}
                                />
                            )) 
                        }
                    </ul>
                    : (
                        <div className="find-friends-illustration">
                            <img  
                                src={friendsIllustration} 
                                alt="find friends illustration"
                            />
                            <p>Find new friends 😸</p>
                        </div>
                    )
                }
            </div>
        </>
    )
}

export default HomeInfobar;