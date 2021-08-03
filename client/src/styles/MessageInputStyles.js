import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    msgInput: {
        width: '88%',
        margin: '0 1.4rem',
        marginRight: '0.5rem',
        marginBottom: '0.4rem',
    },
    msgInputField: {
        border: '1px solid rgba(0, 0, 0, 0.25)',
        height: '2.5rem',
        borderRadius: '20px',
        padding: '10px',
        paddingLeft: '14px',
        fontSize: '0.9rem',
        "&.Mui-focused": {
            outline: 'none',
            boxShadow: '0px 2px 21px 2px rgba(0, 0, 0, 0.2)',
           " -webkit-box-shadow": '0px 2px 21px 2px rgba(0, 0, 0, 0.2)',
            "-moz-box-shadow": '0px 2px 21px 2px rgba(0, 0, 0, 0.2)',
        }
    },
    inputBtns: {
        fontSize: '1.4rem',
        color: 'rgba(0, 0, 0, 0.3)',
        cursor: 'pointer',
        transition: 'color 300ms ease',
        '&:hover': {
            color: '#4849a1'
        }
    },
    emojiPicker: {
        "&::-webkit-scrollbar": {
            width: '5px'
        },
        "&::-webkit-scrollbar-track": {
            borderRadius: '10px'
        },
        "&::-webkit-scrollbar-thumb": {
            backgroundColor: "transparent",
	        borderRadius: "10px",
        },
        "&.message-list::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.3)"
        },
        // "&::-webkit-scrollbar-thumb": {
        //     backgroundColor: "rgba(0, 0, 0, 0.1)"
        // }
    }
}));

export default useStyles;