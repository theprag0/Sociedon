import React, { useContext, useState } from 'react';
import { Image } from 'cloudinary-react';
import { MessengerContext } from '../../../contexts/messenger.context';
import Tooltip from '@material-ui/core/Tooltip';
import Zoom from '@material-ui/core/Zoom';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import useTooltipStyles from '../../../styles/TooltipStyles';
import { getAvatar } from '../../../helpers/getAvatar';
import multimediaIllustration2 from '../../../assets/svg/multimedia-illus-2.svg';
import fileSharingIllustration from '../../../assets/images/file-sharing-illus.jpg';

function ChatboxInfobar({userData}) {
    const {chatboxUser} = useContext(MessengerContext);
    const [tooltipIsOpen, setTooltipIsOpen] = useState({btn1: false, btn2: false});
    const tooltipClasses = useTooltipStyles();
    console.log(chatboxUser)
    const handleTooltipClose = () => {
        setTooltipIsOpen({btn1: false, btn2: false});
    };
    const handleTooltipOpen = e => {
        e.stopPropagation();
        console.log(e.currentTarget.title)
        if(e.currentTarget.title === 'btn1') {
            setTooltipIsOpen({btn1: true, btn2: false});
        } else {
            setTooltipIsOpen({btn1: false, btn2: true});
        }
    };    

    return (
        <>
            <h1 className="chatbox-infobar-headings" style={{paddingBottom: '0.5rem'}}>Members - 2</h1>
            <div className="chatbox-profile-pictures">
                <span>
                    {
                        userData.avatar && userData.avatar.avatarType === 'defaultAvatar'
                        ? <img src={getAvatar(userData.avatar.avatarId)} alt="user profile pic"/>
                        : <Image 
                            cloudName={process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}
                            publicId={userData.avatar && userData.avatar.avatarId}
                            alt="user profile pic"
                        />
                    }
                    <p>You</p>
                </span>
                {
                    chatboxUser && chatboxUser.avatar && chatboxUser.avatar.avatarType === 'defaultAvatar'    
                    ? <img 
                        src={getAvatar(chatboxUser.avatar.avatarId)} 
                        alt="friend profile pic"
                    />
                    : <Image 
                        cloudName={process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}
                        publicId={chatboxUser.avatar && chatboxUser.avatar.avatarId}
                        alt="friend profile pic"
                    />
                }
            </div>
            <hr className="Infobar-hr"/>
            <div className="multimedia">
                <h1 className="chatbox-infobar-headings">Photos & Multimedia</h1>
                <img src={multimediaIllustration2} alt="file sharing"/>
                <p>Start sharing images and videos ????</p>
                <ClickAwayListener onClickAway={handleTooltipClose}>
                    <Tooltip
                        classes={tooltipClasses} 
                        title={
                            <div className="upcoming-feature">
                                <img src={fileSharingIllustration} alt="voice-call illustration"/>
                                <h1>File Sharing</h1>
                                <em><p>Upcoming Feature</p></em>
                                <p>Share your favourite images, files and other multimedia.</p>
                                <p>Stay Tuned! ????</p>
                            </div>
                        } 
                        placement="top" 
                        TransitionComponent={Zoom} 
                        TransitionProps={{ timeout: 600 }}
                        open={tooltipIsOpen.btn1}
                        disableFocusListener
                        disableHoverListener
                        disableTouchListener
                        arrow
                    >
                        <div>
                            <button className="view-all" title="btn1" onClick={handleTooltipOpen}>View All</button>
                        </div>
                    </Tooltip>
                </ClickAwayListener>
            </div>
            <hr className="Infobar-hr"/>
            <div className="attachments">
                <h1 className="chatbox-infobar-headings">Attachments</h1>
                <p>No attachments found ????</p>
                <ClickAwayListener onClickAway={handleTooltipClose}>
                    <Tooltip
                        classes={tooltipClasses} 
                        title={
                            <div className="upcoming-feature">
                                <img src={fileSharingIllustration} alt="voice-call illustration"/>
                                <h1>File Sharing</h1>
                                <em><p>Upcoming Feature</p></em>
                                <p>Share your favourite images, files and other multimedia.</p>
                                <p>Stay Tuned! ????</p>
                            </div>
                        } 
                        placement="top" 
                        TransitionComponent={Zoom} 
                        TransitionProps={{ timeout: 600 }}
                        open={tooltipIsOpen.btn2}
                        disableFocusListener
                        disableHoverListener
                        disableTouchListener
                        arrow
                    >
                        <div>
                            <button className="view-all" title="btn2" onClick={handleTooltipOpen}>View All</button>
                        </div>
                    </Tooltip>
                </ClickAwayListener>
            </div>
        </>
    );
}

export default ChatboxInfobar;