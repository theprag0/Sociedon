import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { AuthenticationContext } from '../../contexts/auth.context';
import '../../styles/Messenger.css';

function SearchList({userData, type, showAlert}) {
    const [requestSent, setRequestSent] = useState(false);
    const {user} = useContext(AuthenticationContext);

    // Check if request already exists
    useEffect(() => {
        if(userData.sent) setRequestSent(true);
    }, [userData.sent]);

    // Send friend request 
    const handleClick = e => {
        // e.target
        console.dir(e.currentTarget)
        axios.put('/messenger/add', {from: user.id, recipient: userData._id})
            .then(res => {
                console.log(res)
                const message = res.data.msg;
                showAlert(message, 'success');
                setRequestSent(true);
            })
            .catch(err => {
                console.log(err)
                showAlert("Couldn't send friend request", 'error')
            });
    }

    return (
        <li>
            <p>{(type === 'friends' ? userData.username : userData.name) || userData.msg}</p>
            {
                userData.msg
                ?
                ''
                :
                <button onClick={handleClick} disabled={requestSent}>
                    <i className={`fas fa-${requestSent ? 'check' : 'user-plus'}`}></i>
                </button>
            }
        </li>
    );
}

export default SearchList;