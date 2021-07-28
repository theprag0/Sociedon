import React, { createContext, useState } from 'react';

export const MessengerContext = createContext();

export function MessengerProvider(props) {
    const [friends, setFriends] = useState([]);
    const [onlineFriends, setOnlineFriends] = useState([]);

    const payload = {
        friends,
        setFriends,
        onlineFriends,
        setOnlineFriends
    }

    return (
        <MessengerContext.Provider value={payload}>
            {props.children}
        </MessengerContext.Provider>
    );
}