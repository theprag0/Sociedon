import React, { useContext, useState } from 'react';
import { MessengerContext } from '../../contexts/messenger.context';
import { Picker } from 'emoji-mart';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Popover from '@material-ui/core/Popover';
import Tooltip from '@material-ui/core/Tooltip';
import Zoom from '@material-ui/core/Zoom';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import SentimentVerySatisfiedIcon from '@material-ui/icons/SentimentVerySatisfied';
import 'emoji-mart/css/emoji-mart.css'
import useInputState from '../../hooks/useInputState';
import useStyles from '../../styles/MessageInputStyles';
import useTooltipStyles from '../../styles/TooltipStyles';
import fileSharingIllustration from '../../assets/images/file-sharing-illus.jpg';

function MessageInput({addMessage, userId}) {
    const {chatboxUser} = useContext(MessengerContext);
    const [message, setMessage, resetMessage, setEmoji] = useInputState('', false);
    const [anchorEl, setAnchorEl] = useState(null);
    const classes = useStyles();
    const tooltipClasses = useTooltipStyles();

    const handleSubmit = e => {
        e.preventDefault();
        if(message !== '') {
            addMessage({
                from: userId, 
                recipient: chatboxUser._id,
                timestamp: Date.now(), 
                message: message.trim()
            });
            resetMessage();
        }
    }

    const openEmojiPicker = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const closeEmojiPicker = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'emoji-picker' : undefined;

    // Add emoji to message on select
    const addEmoji = emoji => {
        setEmoji(emoji.native);
    }

    return (
        <>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={closeEmojiPicker}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                  transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
            >
                <Picker 
                    onSelect={addEmoji} 
                    set="facebook"
                    title="Choose your emoji"
                    theme="auto"
                />
            </Popover>
            <form className="message-input" onSubmit={handleSubmit} style={{height: '10%'}}>
                <TextField
                    placeholder="Type your message..."
                    className={classes.msgInput}
                    value={message}
                    onChange={setMessage}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Tooltip
                                    classes={tooltipClasses} 
                                    title={
                                        <div className="upcoming-feature">
                                            <img src={fileSharingIllustration} alt="voice-call illustration"/>
                                            <h1>File Sharing</h1>
                                            <em><p>Upcoming Feature</p></em>
                                            <p>Share your favourite images, files and other multimedia.</p>
                                            <p>Stay Tuned! 😉</p>
                                        </div>
                                    } 
                                    placement="top" 
                                    TransitionComponent={Zoom} 
                                    TransitionProps={{ timeout: 600 }}
                                    arrow
                                >
                                    <AddCircleOutlineIcon className={classes.inputBtns}/>
                                </Tooltip>
                            </InputAdornment>
                        ),
                        endAdornment: (
                            <InputAdornment position="end" onClick={openEmojiPicker} aria-describedby={id}>
                                <SentimentVerySatisfiedIcon className={classes.inputBtns}/>
                            </InputAdornment>
                        ),
                        className: classes.msgInputField,
                        disableUnderline: true,
                    }}
                />
                <button type="submit" style={{marginTop: '0.5rem'}}>
                    <i className="fas fa-paper-plane"></i>
                </button>
            </form>
        </>
    );
}

export default MessageInput;