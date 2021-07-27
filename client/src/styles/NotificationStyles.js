import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      position: 'absolute',
      top: 0,
      right: '5rem',
      margin: '1rem',
    },
    paper: {
      marginRight: theme.spacing(2),
    },
    popper: {
        width: 'fit-content'
    },
    notif: {
        position: 'relative',
        display: 'block',
        backgroundColor: '#f4f4fa',
        color: '#d3d6e0',
        height: '100%',
        padding: '14px',
        borderRadius: '50%'
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
            cursor: 'pointer'
        },
        '&:hover': {
            backgroundColor: '#fff'
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
    }
}));  

export default useStyles;