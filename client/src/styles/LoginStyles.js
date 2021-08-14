import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    Login: {
        height: '100vh',
        width: '100vw',
    },
    loginBg: {
        position: 'fixed',
        right: 0,
        top: 0,
        zIndex: -10,
        width: '70%',
        height: '100vh',
        objectFit: 'fill',
        float: 'right'
    },
    loginForm: {
        width: '40%',
        height: '100%',
        float: 'left',
        zIndex: 10,
        borderTopRightRadius: "35px",
        borderBottomRightRadius: "35px",
        backgroundColor: '#fff',
        boxShadow: "7px 2px 24px 2px rgba(0, 0, 0, 0.49)",
        WebkitBoxShadow: "7px 2px 24px 2px rgba(0, 0, 0, 0.49)",
        MozBoxShadow: "7px 2px 24px 2px rgba(0, 0, 0, 0.49)",
        "& h1": {
            padding: "1rem 3rem",
            paddingBottom: "8px",
            color: "#171723",
            fontFamily: "'Raleway', sans-serif",
            fontWeight: 800,
            fontSize: "1.7rem",
            letterSpacing: "1px",
        },
        "& p": {
            padding: "0 3rem",
            fontFamily: "'Raleway', sans-serif",
            fontWeight: 400,
            letterSpacing: "1px",
            color: "#b6b6b8",
        },
        "& form": {
            paddingTop: '2rem'
        }
    },
    formHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        "& h1": {
            fontSize: '12px',
            fontWeight: 600,
            fontFamily: "'Nunito', sans-serif",
            textTransform: 'uppercase',
            letterSpacing: '1px',
            padding: '1rem 3rem',
            paddingBottom: '8px'
        },
        "& p": {
            fontFamily: "'Knewave', cursive",
            color: 'rgba(56, 35, 57, 0.9)',
            letterSpacing: '1px',
            padding: '0 3rem'
        }
    },
    formHr: {
        border: 0,
        height: 0,
        borderTop: "1px solid rgba(0, 0, 0, 0.1)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.3)",
    },
    inputField: {
        borderRadius: '12px',
        width: '80%',
        marginBottom: '1.3rem',
        '&$focused $notchedOutline': {
            border: '2px solid #A5363A'
        },
        "&:hover:not($disabled):not($focused):not($error) $notchedOutline": {
            border: '1px solid #A5363A'
        }
    },
    focused: {},
    notchedOutline: {},
    label: {
        fontFamily: "'Nunito', sans-serif",
        fontWeight: 600,
        letterSpacing: '1px',
        '&$focused': {
            color: '#A5363A'
        },
    },
    btn: {
        width: '40%',
        margin: '0 3rem',
        marginTop: '1rem',
        borderRadius: '12px',
        border: 'none',
        backgroundColor: 'rgba(56, 35, 57, 0.95)',
        padding: '10px',
        color: '#fff',
        cursor: 'pointer',
        fontFamily: "'Nunito', sans-serif",
        fontWeight: 600,
        letterSpacing: '2px',
        textTransform: 'uppercase',
        '&:disabled': {
            backgroundColor: 'rgba(56, 35, 57, 0.7)',
            color: '#fff',
            cursor: 'default',
            '&:hover': {
                backgroundColor: 'rgba(56, 35, 57, 0.7)'
            }
        },
        '&:hover': {
            backgroundColor: 'rgba(56, 35, 57, 1)'
        }
    },
}));

export default useStyles;