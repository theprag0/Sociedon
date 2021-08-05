import React, { useContext, useEffect } from 'react';
import { AuthenticationContext } from '../../../contexts/auth.context';
import { SocketContext } from '../../../contexts/socket.context';
import { MessengerContext } from '../../../contexts/messenger.context';
import HomeInfobar from './HomeInfobar';
import '../../../styles/Infobar.css';

function Infobar({userId}) {
    const {userData} = useContext(AuthenticationContext);
    const {socket} = useContext(SocketContext);
    const {friends, setFriends, currentBody} = useContext(MessengerContext);

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

    let infobarBody;
    if(currentBody === 'home') {
        infobarBody = (
            <HomeInfobar 
                userData={userData}
                userId={userId}
                friends={friends}
            />
        );
    }

    return (
        <>
        <section className="Infobar">
            {infobarBody}
        </section>
        </>
    );
}

export default Infobar;