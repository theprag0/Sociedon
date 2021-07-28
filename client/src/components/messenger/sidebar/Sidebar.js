import React, { useEffect, useContext } from 'react';
import axios from 'axios';
import { MessengerContext } from '../../../contexts/messenger.context';
import { AuthenticationContext } from '../../../contexts/auth.context';
import SidebarPanel from './SidebarPanel';

function Sidebar({userId}) {
    const {onlineFriends, setOnlineFriends} = useContext(MessengerContext);
    const {token} = useContext(AuthenticationContext);

    useEffect(() => {
        const config = {
            headers: {'x-auth-token': token}
        }
        axios.get(`/messenger/retrieve/onlineFriends/${userId}`, config)
            .then(res => {
                if(res.data && res.data.onlineFriends) {
                    setOnlineFriends(res.data.onlineFriends);
                }
            }).catch(err => console.log(err));
    }, [token, userId]);

    return (
        <nav className="Sidebar">
            <SidebarPanel />
            <div className="Sidebar-friends">
                <span>
                    <h1 style={{display: 'inline-block', marginRight: '1rem'}}>Conversations</h1>
                    <i className="fas fa-search sidebar-icon-1"></i>
                </span>
                <div>
                    <ul>
                        {
                            onlineFriends.length > 0 
                            ?
                            onlineFriends.map(f => (
                                <li>
                                    {f.username}
                                </li>
                            ))
                            :
                            ''
                        }
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default Sidebar;