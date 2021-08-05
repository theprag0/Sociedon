import React, { useContext, useEffect } from 'react';
import { SocketContext } from '../../../contexts/socket.context';
import { MessengerContext } from '../../../contexts/messenger.context';
import FriendsListItem from '../sidebar/FriendsListItem';

function Infobar({userId}) {
    const {socket} = useContext(SocketContext);
    const {friends, setFriends} = useContext(MessengerContext);

    // Listen for accepted friend requests
    useEffect(() => {
        if(socket !== null) {
            socket.on('friend-request accepted', data => {
                setFriends(currFriends => [...currFriends, data.friendData]);
            });
        }

        return () => {
            if(socket !== null) socket.off('friend-request accepted');
        }
    }, [socket]);

    return (
        <section>
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
        </section>
    );
}

export default Infobar;