import React from 'react';
import { Image } from 'cloudinary-react';
import MenuItem from '@material-ui/core/MenuItem';
import { getAvatar } from '../../helpers/getAvatar';
import useStyles from '../../styles/NotificationStyles';

function NotificationItem({requestData, userId, handleRequest}) {
    const classes = useStyles();

    const handleClick = e => {
        handleRequest(e, userId, requestData.fromId);
    }

    return (
        <MenuItem className={classes.request}>
            {
                requestData.avatar && requestData.avatar.avatarType === 'defaultAvatar'
                ? <img src={getAvatar(requestData.avatar.avatarId)} alt="user avatar" className={classes.userAvatar}/>
                : <Image 
                    cloudName={process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}
                    publicId={requestData.avatar && requestData.avatar.avatarId}
                    className={classes.userAvatar}
                    alt="user avatar"
                />
            }
            <p>{requestData.fromUsername}</p>
            <i className={`fas fa-check ${classes.accept}`} title="accept" onClick={handleClick} style={{marginLeft: '15px'}}></i>
            <i className={`fas fa-times ${classes.reject}`} title="decline" onClick={handleClick}></i>
        </MenuItem>
    );
}

export default NotificationItem;