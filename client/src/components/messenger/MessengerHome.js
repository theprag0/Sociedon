import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { AuthenticationContext } from '../../contexts/auth.context';
import { MessengerContext } from '../../contexts/messenger.context'; 
import OnlineUserItem from './OnlineUserItem';
import getDefaultPicture from '../../helpers/getDefaultPicture';
import noOnlineFriends from '../../assets/svg/no-online-illus.svg';
import noRequests from '../../assets/svg/no-requests-illus.svg';

function MessengerHome({userId}) {
    const {token} = useContext(AuthenticationContext);
    const {friends, sentRequests, setSentRequests} = useContext(MessengerContext);
    const [currTab, setCurrTab] = useState('online');

    // Retrieve sent friend requests
    useEffect(() => {
        const config = {
            headers: {'x-auth-token': token}
        };
        axios.get(`/messenger/retrieve/sentRequests/${userId}`, config)
            .then(res => {
                setSentRequests(res.data.requests);
            }).catch(err => console.log(err));
    }, [friends]);

    // Change tab
    const changeTab = e => {
        setCurrTab(e.currentTarget.name);
    }

    let onlineUsers;
    if(friends && friends.length > 0) {
        onlineUsers = friends.filter(f => f.status === 'online');
    }

    return (
        <>
            <nav className="MessengerHome-nav">
                <button 
                    name="online" 
                    className={currTab === 'online' ? 'tab-selected' : ''} 
                    onClick={changeTab}
                >
                    Online
                </button>
                <button 
                    name="pending" 
                    className={currTab === 'pending' ? 'tab-selected' : ''} 
                    onClick={changeTab}
                >
                    Pending
                </button>
            </nav>
            {
                currTab === 'online' 
                ? (<section className="MessengerHome">
                    {
                        onlineUsers && onlineUsers.length > 0
                        ? (
                            <ul>
                                {
                                    onlineUsers.map(f => {
                                        return (
                                            <OnlineUserItem
                                                key={f._id} 
                                                userData={f} 
                                                userId={userId}
                                            />
                                        )
                                    })
                                }
                            </ul>
                        )
                        : (
                            <div className="no-online-users">
                                <img src={noOnlineFriends} alt="no online friends illustration"/>
                                <p>Noone around to hangout 😪</p>
                            </div>
                        )
                    }
                </section>)
                : (
                    <section className="MessengerHome">
                        {
                            sentRequests && sentRequests.length > 0
                            ? (
                                <ul id="sent-requests-list">
                                    {sentRequests.map(r => (
                                        <li key={r._id} className="sent-requests">
                                            <div className="img-container">
                                                <img 
                                                    className="user-avatar" 
                                                    src={r.defaultImage ? getDefaultPicture(r.defaultImage) : r.image}
                                                    alt="user avatar"
                                                />
                                            </div>
                                            <p>{r.username}</p>
                                            <p>Friend Request Sent</p>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="no-online-users">
                                    <img src={noRequests} alt="no online friends illustration"/>
                                    <p style={{paddingTop: '1rem'}}>No pending sent-requests 🙃</p>
                                </div>
                            )
                        }
                    </section>
                )
            }
        </>
    )
}

export default MessengerHome;