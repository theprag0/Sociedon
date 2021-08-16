import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      position: 'absolute',
      top: 0,
      right: '6rem',
      margin: '1rem',
      marginTop: '0.5rem',
    },
    paper: {
      marginRight: theme.spacing(2),
    },
    popper: {
        width: 'fit-content',
        zIndex: 20
    },
    notif: {
        position: 'relative',
        display: 'block',
        backgroundColor: '#f4f4fa',
        color: '#d3d6e0',
        height: '100%',
        padding: '14px',
        borderRadius: '50%',
        transition: 'background-color, color 300ms ease-in-out',
        '&:hover': {
            backgroundColor: '#4849a1',
            color: '#fff'
        }
    },
    notifNum: {
        position: 'absolute',
        right: '2px',
        top: '-8px',
        backgroundColor: '#f95959',
        color: '#fff',
        borderRadius: '50%',
        padding: '3px 5px',
        fontSize: '12px',
        fontFamily: 'Roboto'
    },
    button: {
        '&:hover': {
            backgroundColor: 'transparent',
        }
    },
    request: {
        cursor: 'default',
        '& i': {
            margin: '0 5px',
            borderRadius: '50%',
            cursor: 'pointer',
        },
        '&:hover': {
            backgroundColor: '#fff'
        },
        "& p": {
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 600
        }
    },
    accept: {
        border: '1px solid #4bb543',
        padding: '5px',
        color: '#4bb543'
    },
    reject: {
        border: '1px solid #fc100d',
        color: '#fc100d',
        padding: '5px',
        paddingRight: '8px',
        paddingLeft: '8px'
    },
    userAvatar: {
        height: '2.5rem',
        width: '2.5rem',
        borderRadius: '50%',
        marginRight: '10px'
    },
}));  

export default useStyles;