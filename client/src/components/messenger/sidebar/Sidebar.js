import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import onClickOutside from 'react-onclickoutside';
import { AuthenticationContext } from '../../../contexts/auth.context';
import { SocketContext } from '../../../contexts/socket.context';
import { MessengerContext } from '../../../contexts/messenger.context';
import useInputState from '../../../hooks/useInputState';
import SidebarPanel from './SidebarPanel';
import FriendsListItem from './FriendsListItem';
import '../../../styles/Sidebar.css';
import findFriends from '../../../assets/images/friends-chat2.png';
import search from '../../../assets/svg/search.svg';

function Sidebar({userId}) {
    const {token} = useContext(AuthenticationContext);
    const {socket} = useContext(SocketContext);
    const {chatboxUser, conversations, setConversations, friends} = useContext(MessengerContext);
    const [searchQuery, setSearchQuery, resetSearchQuery] = useInputState('', false);
    const [searchResult, setSearchResult] = useState([]);
    const [searchBarIsOpen, setSearchBarIsOpen] = useState(false);

    // Load user's conversations/direct messages
    useEffect(() => {
        const config = {
            headers: {'x-auth-token': token}
        };
        axios.get(`/messenger/retrieve/conversations/${userId}`, config)
            .then(res => {
                if(res.data && res.data.conversations) {
                    setConversations(res.data.conversations);
                }
            })
            .catch(err => console.log(err));
    }, [token, userId]);

    // Update unread messages if chatbox is not open
    useEffect(() => {
        setTimeout(() => {
            if(socket !== null && (!chatboxUser || Object.keys(chatboxUser).length === 0) && friends && friends.length > 0) {
                socket.on('private message', data => {
                    // Check if conversation with user exists
                    setConversations(currConvo => {
                        // Check if conversation exists
                        const foundConversation = currConvo.filter(c => c._id === data.from);
                        if(foundConversation && foundConversation.length > 0) {
                            const updateConversations = currConvo.map(c => {
                                if(data.from === c._id) {
                                    const unreadMessages = c.unreadMessages ? c.unreadMessages + 1 : 1;
                                    return {...c, lastMessageFromFriend: data, unreadMessages};
                                } else {
                                    return c;
                                }
                            });
                            return updateConversations;
                        } 
                        const friendData = friends.filter(f => f._id === data.from)[0];
                        return [...currConvo, {...friendData, lastMessageFromFriend: data, unreadMessages: 1}];
                    })
                });
            } 
        }, 1000);
    }, [socket, chatboxUser, friends]);

    // Search Conversations
    const toggleSearchBar = e => {
        setSearchBarIsOpen(currState => !currState);
        resetSearchQuery();
    };
    Sidebar.handleClickOutside = () => {
        setSearchBarIsOpen(false);
        resetSearchQuery();
    };

    useEffect(() => {
        if(conversations && conversations.length > 0 && searchQuery !== '') {
            const searchResults = conversations.filter(c => (
                c.username.toUpperCase().search(searchQuery.toUpperCase()) !== -1
            ));
            console.log(searchResults);
            setSearchResult(searchResults);
        }
    }, [searchQuery]);

    let conversationsList;
    if(searchQuery !== '' && searchResult.length > 0) {
        conversationsList = (
            searchResult.map(c => (
                <React.Fragment key={c._id}>
                    <FriendsListItem 
                        userId={userId}
                        userData={c}
                        selected={(chatboxUser && chatboxUser._id === c._id) ? true : false}
                    />
                </React.Fragment>
            ))
        );
    } else if(searchQuery !== '' && searchResult.length === 0) {
        conversationsList = (
            <div className="find-friends">
                <img className="Sidebar-illustration" src={search} alt="No Results Found"/>
                <p style={{textAlign: 'center'}}>
                    No conversations found!
                </p>
            </div>
        )
    } else if(searchQuery === '' && conversations && conversations.length > 0) {
        conversationsList = (
            conversations.map(c => (
                <React.Fragment key={c._id}>
                    <FriendsListItem 
                        userId={userId}
                        userData={c}
                        selected={(chatboxUser && chatboxUser._id === c._id) ? true : false}
                    />
                </React.Fragment>
            ))
        );
    } 

    return (
        <nav className="Sidebar">
            <SidebarPanel />
            <div className="Sidebar-friends">
                <span>
                    <h1 style={{display: 'inline-block', marginRight: '1rem'}}>Conversations</h1>
                    <span className="search-bar">
                        <i className="fas fa-search sidebar-icon-1" onClick={toggleSearchBar}></i>
                        <input 
                            type="text" 
                            placeholder="Search conversations..." 
                            value={searchQuery}
                            onChange={setSearchQuery}
                            className={searchBarIsOpen ? 'search-bar-open' : ''}
                        />
                    </span>
                </span>
                <div className="friends-list">
                    {
                        (conversations && conversations.length > 0) 
                        ?
                        <ul style={{marginTop: '1rem'}}>
                            {conversationsList}
                        </ul>
                        :
                        (
                            <div className="find-friends">
                                <img className="Sidebar-illustration" src={findFriends} alt="find friends illustration"/>
                                <p style={{textAlign: 'center'}}>
                                    No Conversations yet! Start hanging out with your friends 😃
                                </p>
                            </div>
                        )
                    }
                </div>
            </div>
        </nav>
    )
}

const clickedOutsideConfig = {
    handleClickOutside: () => Sidebar.handleClickOutside
};

export default onClickOutside(Sidebar, clickedOutsideConfig);