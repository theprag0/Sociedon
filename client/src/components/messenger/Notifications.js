import React, { useState, useRef, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthenticationContext } from '../../contexts/auth.context';
import { SocketContext } from '../../contexts/socket.context';
import { MessengerContext } from '../../contexts/messenger.context';
import Button from '@material-ui/core/Button';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import NotificationItem from './NotificationItem';
import useStyles from '../../styles/NotificationStyles';
import { withSnackbar } from '../utility/SnackbarHOC';

function Notifications({userId, snackbarShowMessage}) {
    const {token} = useContext(AuthenticationContext);
    const {socket} = useContext(SocketContext);
    const {setFriends} = useContext(MessengerContext);
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const [friendRequests, setFriendRequests] = useState([]);
    const anchorRef = useRef(null);

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    function handleListKeyDown(event) {
        if (event.key === 'Tab') {
          event.preventDefault();
          setOpen(false);
        }
    }
    
    // return focus to the button when we transitioned from !open -> open
    const prevOpen = useRef(open);
    useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus();
        }
        prevOpen.current = open;
    }, [open]);

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setOpen(false);
    };

    // Retrieve existing friend requests
    useEffect(() => {
        const config = {
            headers: {'x-auth-token': token}
        };
        axios.get(`/messenger/retrieve/friendRequests/${userId}`, config)
            .then(res => {
                setFriendRequests([...res.data.requests]);
            })
            .catch(err => console.log(err));
    }, [userId, token]);

    //Listen for new friend request
    useEffect(() => {
        if(socket !== null) {
            socket.on('newFriendRequest', ({fromId, fromUsername}) => {
                setFriendRequests(friendRequests => [...friendRequests, {fromId, fromUsername}]);
            });
        }
    }, [socket]);

    // Handle friend request actions
    const handleRequest = (e, currUserId, fromId) => {
        const config = {
            headers: {
                'x-auth-token': token
            }
        }
        axios.put('/messenger/add', {
            type: 'requestActions',
            action: e.target.title,
            currUserId,
            fromId
        }, config)
        .then(res => {
            const filterFriendRequests = friendRequests.filter(f => f.fromId !== fromId);
            setFriendRequests(filterFriendRequests);
            if(e.target.title === 'accept') {
                setFriends(currFriends => [...currFriends, res.data.friendData]);
            }
            snackbarShowMessage(
                e.target.title === 'accept' ? `${res.data.msg} 😎` : `${res.data.msg} 🤡`, 
                'success'
            );
        })
        .catch(err => {
            console.log(err);
            snackbarShowMessage(`${err.response.data.msg} 😔`, 'error');
        });
    }

    return (
        <div className={classes.root}>
            <Button
                ref={anchorRef}
                aria-controls={open ? 'menu-list-grow' : undefined}
                aria-haspopup="true"
                onClick={handleToggle}
                className={classes.button}
            >
                <i className={`fas fa-user-friends fa-1x ${classes.notif}`}>
                    <span 
                        className={classes.notifNum}
                        style={{display: friendRequests.length === 0 ? 'none': 'block'}}
                    >
                        {friendRequests.length > 0 ? friendRequests.length : ''}
                    </span>
                </i>
            </Button>
            <Popper 
                className={classes.popper} 
                open={open} 
                anchorEl={anchorRef.current} 
                role={undefined} 
                transition 
                disablePortal
            >
                {({ TransitionProps, placement }) => (
                <Grow
                    {...TransitionProps}
                    style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                >
                    <Paper>
                    <ClickAwayListener onClickAway={handleClose}>
                        <MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                            {
                                friendRequests.length > 0 
                                ?
                                friendRequests.map(f => (
                                    <NotificationItem 
                                        key={f.fromId} 
                                        requestData={f} 
                                        userId={userId}
                                        handleRequest={handleRequest}
                                    />
                                ))
                                :
                                <MenuItem className={classes.request}>
                                    No Pending Requests 👾
                                </MenuItem>
                            }
                        </MenuList>
                    </ClickAwayListener>
                    </Paper>
                </Grow>
                )}
            </Popper>
        </div>
      );
}

export default withSnackbar(Notifications);