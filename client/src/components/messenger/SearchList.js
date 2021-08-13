import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { Image } from 'cloudinary-react';
import { AuthenticationContext } from '../../contexts/auth.context';
import { MessengerContext } from '../../contexts/messenger.context';
import { getAvatar } from '../../helpers/getAvatar';
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
            {
                userSearchData.avatar && userSearchData.avatar.avatarType === 'defaultAvatar'
                ? <img 
                    src={getAvatar(userSearchData.avatar.avatarId)} 
                    alt="user avatar" 
                    className="user-avatar"
                    style={{width: '2.5rem', height: '2.5rem', paddingTop: '5px'}}
                />
                : <Image 
                    cloudName={process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}
                    publicId={userSearchData.avatar && userSearchData.avatar.avatarId}
                    className="user-avatar"
                    style={{width: '2.5rem', height: '2.5rem', paddingTop: '5px'}}
                    alt="user avatar"
                />
            }
            <p style={{paddingBottom: 0}}>
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