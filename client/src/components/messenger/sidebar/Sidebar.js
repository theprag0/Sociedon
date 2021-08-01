import React, { useContext } from 'react';
import { MessengerContext } from '../../../contexts/messenger.context';
import SidebarPanel from './SidebarPanel';
import FriendsListItem from './FriendsListItem';
import '../../../styles/Sidebar.css';
import findFriends from '../../../assets/images/friends-chat2.png';

function Sidebar({userId}) {
    const {friends, chatboxUser} = useContext(MessengerContext);
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
                        (friends && friends.length > 0) 
                        ?
                        <ul style={{marginTop: '1rem'}}>
                            {friends.map(f => (
                                <React.Fragment key={f._id}>
                                    <FriendsListItem 
                                        userId={userId}
                                        userData={f}
                                        selected={(chatboxUser && chatboxUser._id === f._id) ? true : false}
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