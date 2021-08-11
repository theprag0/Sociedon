import { makeStyles } from '@material-ui/core/styles';
import authBackground from '../assets/images/auth-background.png';
import avatarPickerBg from '../assets/images/avatar-picker-bg.jpg';

const useStyles = makeStyles((theme) => ({
    root: {
      padding: '0 1rem',
      paddingRight: '10rem',
      margin: 0,
    },
    Register: {
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        backgroundImage: `url(${authBackground})`,
        backgroundSize: "68% 100%",
        backgroundPosition: "right",
        backgroundRepeat: "no-repeat",
    },
    RegisterFiller: {
        width: "65%",
	    height: "100%",
    },
    registerForm: {
        width: "35%",
        height: "100%",
        backgroundColor: "#fff",
        borderTopRightRadius: "35px",
        borderBottomRightRadius: "35px",
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
        }
    },
    registerFormGroup: {
        padding: '0 3rem'
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
        }
    },
    icon:{
        color: "#ccc",
        "&$activeIcon": {
            color: "#f95959"
        },
        "&$completedIcon": {
            color: "#f95959"
        }
    },
    activeIcon: {
        color: '#f95959'
    },
    completedIcon: {
        color: '#f95959'
    },
    selectField: {
        marginRight: '10px',
        marginBottom: '10px',
        borderRadius: '12px'
    },
    inputField: {
        borderRadius: '12px',
        width: '80%',
        marginBottom: '1.3rem'
    },
    validateField: {
        borderRadius: '12px',
        width: '80%',
        marginBottom: '1.3rem',
    },
    passwordInfo: {
        fontFamily: 'Montserrat',
        padding: '10px',
        "& p": {
            fontSize: '12px',
            letterSpacing: '1px',
            paddingBottom: '5px'
        },
        "& ul li": {
            letterSpacing: '1px',
            paddingBottom: '4px'
        }
    },
    btn: {
        width: '40%',
        marginTop: '1rem',
        borderRadius: '12px',
        border: 'none',
        backgroundColor: 'rgba(72, 73, 161, 0.95)',
        padding: '10px',
        color: '#fff',
        cursor: 'pointer',
        '&:disabled': {
            backgroundColor: 'rgba(72, 73, 161, 0.7)',
            color: '#fff',
            cursor: 'default',
            '&:hover': {
                backgroundColor: 'rgba(72, 73, 161, 0.7)'
            }
        },
        '&:hover': {
            backgroundColor: '#4849a1'
        }
    },
    submitBtn: {
        marginTop: '0.9rem',
        margin: '0 3rem',
        width: '30%',
        color: '#4849a1',
        border: '2px solid #4849a1',
        '&:hover': {
            transition: 'background-color 1000 ease',
            backgroundColor: '#4849a1',
            color: '#fff'
        },
        '&:disabled': {
            border: '2px solid #4849a1',
            color: '#4849a1',
            cursor: 'default',
        },
    },
    formHr: {
        border: 0,
        height: 0,
        borderTop: "1px solid rgba(0, 0, 0, 0.1)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.3)",
    },
    imageListRoot: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        alignItems: '',
        // overflow: 'hidden',
        padding: '0 3rem',
        width: '80%',
        height: '100%'
    },
    imageList: {
        width: '100%',
        height: 260,
        borderRadius: '5px',
        borderTopLeftRadius: '20px',
        borderBottomLeftRadius: '20px',
        // backgroundColor: 'rgba(57, 155, 210, 0.7)',
        backgroundImage: `url(${avatarPickerBg})`,
        backgroundPosition: 'top',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        boxShadow: "2px 6px 21px 1px rgba(0,0,0,0.6)",
        WebkitBoxShadow: "2px 6px 21px 1px rgba(0,0,0,0.6)",
        MozBoxShadow: "2px 6px 21px 1px rgba(0,0,0,0.6)",
        "& li": {
            marginTop: '5px',
        },
        "& img": {
            borderRadius: '50%',
            border: '2px solid #fff',
            height: '3.5rem',
            width: '3.5rem',
            cursor: 'pointer'
        },
        "&::-webkit-scrollbar": {
            width: '6px'
        },
        "&::-webkit-scrollbar-track": {
            borderRadius: '10px'
        },
        "&::-webkit-scrollbar-thumb": {
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            borderRadius: '10px',
            "&:hover": {
                backgroundColor: 'rgba(0, 0, 0, 0.3)'
            }
        }
    },
    selectedAvatar: {
        border: '4px solid #00BA88 !important',
        position: 'relative'
    },
    selectedIcon: {
        position: 'absolute',
        right: 0,
        color: '#fff',
        backgroundColor: '#00BA88',
        borderRadius: '50%',
        padding: '3px 5px',
        fontSize: '15px',
        fontFamily: 'Roboto',
        zIndex: 10
    },
    uploadAvatar: {
        marginTop: '1.5rem',
        textAlign: 'center',
        "& p": {
            textTransform: 'uppercase',
            paddingBottom: '10px',
            "& span": {
                position: "relative",
                display: "inline-block",
                backgroundColor: "#f1f2f5",
                color: "#a0a8be",
                fontSize: "12px",
                fontFamily: "'Nunito', sans-serif",
                letterSpacing: "1px",
                fontWeight: "600",
                padding: "5px 7px",
                borderRadius: "12px",
                "&:before": {
                    position: "absolute",
                    content: "''",
                    top: "50%",
                    borderBottom: "1px solid",
                    color: "#c4c4d5",
                    width: "10rem",
                    margin: "0 20px",
                    right: "100%"
                },
                "&:after": {
                    position: "absolute",
                    content: "''",
                    top: "50%",
                    borderBottom: "1px solid",
                    color: "#c4c4d5",
                    width: "10rem",
                    margin: "0 20px",
                    left: '100%'
                }
            }
        }
    }
}));

export default useStyles;