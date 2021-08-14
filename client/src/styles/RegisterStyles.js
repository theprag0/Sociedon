import { makeStyles } from '@material-ui/core/styles';
import authBackground from '../assets/images/auth-background.png';
import avatarPickerBg from '../assets/images/avatar-picker-bg.jpg';

const useStyles = makeStyles((theme) => ({
    stepperRoot: {
      padding: '0 1rem',
      paddingRight: '6rem',
      paddingBottom: '0.5rem',
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
        float: 'right',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    registerForm: {
        width: "35%",
        height: "100%",
        float: 'left',
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
        },
        "& p": {
            fontFamily: "'Knewave', cursive",
            color: '#4849a1',
            letterSpacing: '1px'
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
        borderRadius: '12px',
        '&$focused $notchedOutline': {
            border: '2px solid #f95959'
        },
        "&:hover:not($disabled):not($focused):not($error) $notchedOutline": {
            border: '1px solid #f95959'
        }
    },
    inputField: {
        borderRadius: '12px',
        width: '80%',
        marginBottom: '1.3rem',
        '&$focused $notchedOutline': {
            border: '2px solid #f95959'
        },
        "&:hover:not($disabled):not($focused):not($error) $notchedOutline": {
            border: '1px solid #f95959'
        }
    },
    focused: {},
    notchedOutline: {},
    label: {
        fontFamily: "'Nunito', sans-serif",
        fontWeight: 600,
        letterSpacing: '1px',
        '&$focused': {
            color: '#f95959'
        },
    },
    validateField: {
        borderRadius: '12px',
        width: '80%',
        marginBottom: '1.3rem',
        '&$focused $notchedOutline': {
            border: '2px solid #f95959'
        },
        "&:hover:not($disabled):not($focused):not($error) $notchedOutline": {
            border: '1px solid #f95959'
        }
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
        fontFamily: "'Nunito', sans-serif",
        fontWeight: 600,
        letterSpacing: '2px',
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
    },
    filename: {
        margin: 0,
        paddingBottom: '0 !important',
        textTransform: 'none !important',
        color: '#99A1B7 !important'
    },
    infoPaper: {
        marginBottom: '10%',
        width: '60%',
        display: 'flex',
        borderRadius: '12px',
        boxShadow: "0px 6px 17px 2px rgba(0,0,0,0.55)",
        WebkitBoxShadow: "0px 6px 17px 2px rgba(0,0,0,0.55)",
        MozBoxShadow: "0px 6px 17px 2px rgba(0,0,0,0.55)",
    },
    fillerIcon: {
        width: '20%', 
        backgroundColor: '#F3F3F3', 
        textAlign: 'center', 
        borderTopLeftRadius: '12px',
        borderBottomLeftRadius: '12px',
    },
    fillerText: {
        fontFamily: "'Montserrat', sans-serif",
        padding: '1rem',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        "& h1": {
            fontSize: '15px',
            letterSpacing: '1px'
        },
        "& p": {
            fontSize: '13px',
            paddingTop: '5px',
            letterSpacing: '1px'
        }
    },
    fillerStepper: {
        width: '80%',
        // margin: '0 auto',
        marginTop: '10px',
        backgroundColor: 'transparent',
        justifyContent: 'center'
    },
    otpForm: {
        padding: '0 3rem',
        "& p": {
            padding: 0,
            paddingBottom: '2rem',
            "& button": {
                backgroundColor: 'transparent',
                color: '#f95959',
                fontFamily: "'Nunito', sans-serif",
                fontWeight: 600,
                letterSpacing: '1px',
                border: 'none',
                borderBottom: '2px solid #f95959',
                outline: 'none',
                marginRight: '1rem',
                cursor: 'pointer',
                "&:disabled": {
                    color: 'rgba(249, 89, 89, 0.5)',
                    borderBottom: '2px solid rgba(249, 89, 89, 0.5)',
                    cursor: 'default'
                }
            }
        }
    },
    otpInput: {
        width: '100%',
        paddingBottom: '1.5rem'
    },
    otpInfo: {
        marginTop: '2.5rem',
        backgroundColor: 'rgba(249, 89, 89, 0.9)',
        color: '#fff',
        borderRadius: '15px',
        padding: '10px',
        paddingLeft: '2rem',
        fontFamily: "'Nunito', sans-serif",
        fontWeight: 600,
        "& li": {
           letterSpacing: '2px',
           fontSize: '13px',
           paddingBottom: '7px',
           "&:first-child": {
               fontSize: '17px',
               paddingBottom: '5px'
           } 
        }
    }
}));

export default useStyles;