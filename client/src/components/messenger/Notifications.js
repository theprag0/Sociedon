import React, { useState, useRef, useEffect, useContext } from 'react';
import axios from 'axios';
import { SocketContext } from '../../contexts/socket.context';
import Button from '@material-ui/core/Button';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import useStyles from '../../styles/NotificationStyles';

function Notifications({userId}) {
    const {socket} = useContext(SocketContext);
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
        axios.get(`/messenger/add/requests/${userId}`)
            .then(res => {
                setFriendRequests([...res.data.requests]);
            })
            .catch(err => console.log(err));
    }, [userId]);

    //Listen for new friend request
    useEffect(() => {
        if(socket !== null) {
            socket.on('newFriendRequest', ({fromId, fromUsername}) => {
                setFriendRequests([...friendRequests, {fromId, fromUsername}]);
            });
        }
    }, [socket]);

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
            <Popper className={classes.popper} open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
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
                                    <MenuItem key={f.fromId} className={classes.request}>
                                        {f.fromUsername}
                                        <i className={`fas fa-check ${classes.accept}`}></i>
                                        <i className={`fas fa-times ${classes.reject}`}></i>
                                    </MenuItem>
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

export default Notifications;