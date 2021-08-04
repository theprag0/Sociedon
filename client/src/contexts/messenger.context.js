import React, { createContext, useState } from 'react';

export const MessengerContext = createContext();

export function MessengerProvider(props) {
    const [friends, setFriends] = useState([]);
    const [conversations, setConversations] = useState([]);
    // Current Messenger body(Eg: MessengerHome, Chatbox, Arena..)
    const [currentBody, setCurrentBody] = useState('home');
    const [chatboxUser, setChatboxUser] = useState({});
    const [chatboxLoading, setChatboxLoading] = useState(false);

    const payload = {
        friends,
        setFriends,
        conversations,
        setConversations,
        currentBody,
        setCurrentBody,
        chatboxUser,
        setChatboxUser,
        chatboxLoading,
        setChatboxLoading
    }

    return (
        <MessengerContext.Provider value={payload}>
            {props.children}
        </MessengerContext.Provider>
    );
}