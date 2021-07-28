import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import useStyles from '../../styles/NotificationStyles';

function NotificationItem({requestData, userId, handleRequest}) {
    const classes = useStyles();

    const handleClick = e => {
        handleRequest(e, userId, requestData.fromId);
    }

    return (
        <MenuItem className={classes.request}>
            {requestData.fromUsername}
            <i className={`fas fa-check ${classes.accept}`} title="accept" onClick={handleClick}></i>
            <i className={`fas fa-times ${classes.reject}`} title="decline" onClick={handleClick}></i>
        </MenuItem>
    );
}

export default NotificationItem;