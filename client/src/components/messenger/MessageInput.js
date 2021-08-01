import React, { useContext } from 'react';
import { MessengerContext } from '../../contexts/messenger.context';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import SentimentVerySatisfiedIcon from '@material-ui/icons/SentimentVerySatisfied';
import useInputState from '../../hooks/useInputState';
import useStyles from '../../styles/MessageInputStyles';

function MessageInput({addMessage, userId}) {
    const {chatboxUser} = useContext(MessengerContext);
    const [message, setMessage, resetMessage] = useInputState('', false);
    const classes = useStyles();

    const handleSubmit = e => {
        e.preventDefault();
        if(message !== '') {
            addMessage({
                from: userId, 
                recipient: chatboxUser._id, 
                message
            });
            resetMessage();
        }
    }

    return (
        <form className="message-input" onSubmit={handleSubmit} style={{height: '10%'}}>
            <TextField
                placeholder="Type your message..."
                className={classes.msgInput}
                value={message}
                onChange={setMessage}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <AddCircleOutlineIcon className={classes.inputBtns}/>
                        </InputAdornment>
                    ),
                    endAdornment: (
                        <InputAdornment position="end">
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
    );
}

export default MessageInput;