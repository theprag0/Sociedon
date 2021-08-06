import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { AuthenticationContext } from '../../contexts/auth.context';
import { MessengerContext } from '../../contexts/messenger.context';
import { withSnackbar } from '../utility/SnackbarHOC';
import '../../styles/Messenger.css';

function SearchList({userSearchData, type, snackbarShowMessage}) {
    const [requestSent, setRequestSent] = useState(false);
    const {userData, token} = useContext(AuthenticationContext);
    const {setSentRequests} = useContext(MessengerContext);

    // Check if request already exists
    useEffect(() => {
        if(userSearchData.sent) setRequestSent(true);
    }, [userSearchData.sent]);

    // Send friend request 
    const handleClick = e => {
        const config = {
            headers: {'x-auth-token': token}
        }
        axios.put('/messenger/add', {from: userData.userId, recipient: userSearchData._id, type: 'newRequest'}, config)
            .then(res => {
                const message = res.data.msg;
                snackbarShowMessage(`${message} 🐱‍🏍`, 'success');
                setRequestSent(true);
                setSentRequests(currRequests => [...currRequests, res.data.recipientUserData]);
            })
            .catch(err => {
                console.log(err)
                snackbarShowMessage("Couldn't send friend request 😔", 'error')
            });
    }

    return (
        <li>
            <p>
                {(type === 'friends' ? userSearchData.username : userSearchData.name) || userSearchData.msg}
            </p>
            {
                userSearchData.msg
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

export default withSnackbar(SearchList);