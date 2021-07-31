import React from 'react';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import SentimentVerySatisfiedIcon from '@material-ui/icons/SentimentVerySatisfied';
import useStyles from '../../styles/MessageInputStyles';

function MessageInput(props) {
    const classes = useStyles();

    const handleSubmit = e => {
        e.preventDefault();
    }

    return (
        <form className="message-input" onSubmit={handleSubmit}>
            <TextField
                placeholder="Type your message..."
                className={classes.msgInput}
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
            <button type="submit"><i class="fas fa-paper-plane"></i></button>
        </form>
    );
}

export default MessageInput;