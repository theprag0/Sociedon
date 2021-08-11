import React, { useContext, useState } from 'react';
import axios from 'axios';
import { MessengerContext } from '../../contexts/messenger.context';
import { AuthenticationContext } from '../../contexts/auth.context';
import Tooltip from '@material-ui/core/Tooltip';
import Zoom from '@material-ui/core/Zoom';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import groupMessagesByDate from '../../helpers/groupMessagesByDate';
import { getAvatar } from '../../helpers/getAvatar';
import useTooltipStyles from '../../styles/TooltipStyles';
import videoCallIllustration from '../../assets/images/video-call-illus.jpg';
import voiceCallIllustration from '../../assets/images/voice-call-illus.jpg';

function OnlineUserItem({userData, userId}) {
    const {token} = useContext(AuthenticationContext);
    const {setCurrentBody, setChatboxUser, setChatboxLoading} = useContext(MessengerContext);
    const [tooltipIsOpen, setTooltipIsOpen] = useState({videoIcon: false, voiceIcon: false});
    const tooltipClasses = useTooltipStyles();

    const handleClick = e => {
        e.stopPropagation();
        setCurrentBody('chatbox');
        setChatboxLoading(true);
        // Load initial message data
        const config = {
            headers: {'x-auth-token': token}
        };
        axios.post('/messenger/messages', {
            type: 'dm',
            userA: userId,
            userB: userData._id,
            metaData: 'initial-load'
        }, config).then(res => {
            if(res.data.messages && res.data.messages.length > 0) {
                const messages = groupMessagesByDate(res.data.messages);
                const lastDateLoaded = Object.keys(messages)[0];
                setChatboxUser({
                    ...userData, 
                    messages, 
                    lastDateLoaded,
                    unloadedMsgAvailable: res.data.unloadedMsgAvailable
                });
            } else {
                setChatboxUser({...userData, messages: {}});
            }
            setChatboxLoading(false);
        }).catch(err => console.log(err));
    }

    const handleTooltipClose = () => {
        setTooltipIsOpen({videoIcon: false, voiceIcon: false});
    };
    const handleTooltipOpen = e => {
        e.stopPropagation();
        if(e.currentTarget.title === 'video-icon') {
            setTooltipIsOpen({videoIcon: true, voiceIcon: false});
        } else {
            setTooltipIsOpen({videoIcon: false, voiceIcon: true});
        }
    };    

    return (
        <li className='FriendsListItem MessengerHome-item' onClick={handleClick}>
            <div style={{display: 'flex', alignItems: 'center'}}>
                <div className="img-container">
                    <img 
                        className="user-avatar" 
                        src={userData.avatar ? getAvatar(userData.avatar) : userData.image}
                        alt="user avatar"
                    />
                    <p className={userData.status === 'online' ? 'online' : 'offline'}></p>
                </div>
                <p>{userData.username}</p>
            </div>
            <div className="icons">
                <ClickAwayListener onClickAway={handleTooltipClose}>
                    <Tooltip
                        classes={tooltipClasses} 
                        title={
                            <div className="upcoming-feature">
                                <img src={voiceCallIllustration} alt="voice-call illustration"/>
                                <h1>Voice Calls</h1>
                                <em><p>Upcoming Feature</p></em>
                                <p>Enter voice channels with friends.</p>
                                <p>Stay Tuned! 😉</p>
                            </div>
                        } 
                        placement="bottom-end" 
                        TransitionComponent={Zoom} 
                        TransitionProps={{ timeout: 600 }}
                        open={tooltipIsOpen.voiceIcon}
                        disableFocusListener
                        disableHoverListener
                        disableTouchListener
                        arrow
                    >
                        <div>
                            <i className="fas fa-phone-alt" title="voice-icon" onClick={handleTooltipOpen}></i>
                        </div>
                    </Tooltip>
                </ClickAwayListener>
                <ClickAwayListener onClickAway={handleTooltipClose}>
                    <Tooltip
                        classes={tooltipClasses} 
                        title={
                            <div className="upcoming-feature">
                                <img  
                                    src={videoCallIllustration} 
                                    alt="video-call illustration"
                                />
                                <h1>Video Chats</h1>
                                <em><p>Upcoming Feature</p></em>
                                <p>Enter video calls with friends.</p>
                                <p>Stay Tuned! 😉</p>
                            </div>
                        } 
                        placement="bottom-end" 
                        TransitionComponent={Zoom} 
                        TransitionProps={{ timeout: 600 }}
                        open={tooltipIsOpen.videoIcon}
                        disableFocusListener
                        disableHoverListener
                        disableTouchListener
                        arrow
                    >
                        <div>
                            <i className="fas fa-video" title="video-icon" onClick={handleTooltipOpen}></i>
                        </div>
                    </Tooltip>
                </ClickAwayListener>
                <i className="fas fa-comment-alt" onClick={handleClick}></i>
            </div>
        </li>
    );
}

export default OnlineUserItem;