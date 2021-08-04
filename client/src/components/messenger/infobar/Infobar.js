import React, { useContext } from 'react';
import { MessengerContext } from '../../../contexts/messenger.context';
import FriendsListItem from '../sidebar/FriendsListItem';

function Infobar({userId}) {
    const {friends} = useContext(MessengerContext);

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