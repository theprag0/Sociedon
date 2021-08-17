import React, { useEffect } from 'react';
import AOS from 'aos';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Backdrop from '@material-ui/core/Backdrop';
import { makeStyles } from '@material-ui/core/styles';
import 'aos/dist/aos.css';
import globalNotifIllus from '../../assets/images/global-notif.webp'

const useStyles = makeStyles((theme) => ({
    notifCard: {
        height: '75%',
        width: '50%',
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: '-20%',
        marginLeft: '-25%',
        zIndex: 30,
        overflow: 'scroll',
        overflowX: 'hidden',
        backgroundColor: '#2E536B',
        borderRadius: '10px',
        borderTopLeftRadius: '20px',
        borderBottomLeftRadius: '20px',
        "&::-webkit-scrollbar": {
            width: "6px",
        },
        "&::-webkit-scrollbar-track": {
            borderRadius: "10px",
        },
        "&::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(0, 0, 0, 0.3)",
            borderRadius: "10px",
        },
        "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.4)",
        }
    },
    cardImg: {
        height: '60%'
    },
    cardContent: {
        color: '#fff',
        padding: '1.5rem',
        "& h1": {
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '23px',
            letterSpacing: '2px',
            paddingBottom: '5px'
        },
        "& h2": {
            padding: '10px 0',
            fontFamily: "'Sigmar One', cursive",
            letterSpacing: '2px'
        },
        "& h3": {
            padding: '10px 0'
        },
        "& ul": {
            listStyle: 'none',
            "& li": {
                fontFamily: "'Montserrat', sans-serif",
                padding: '5px',
                fontSize: '16px',
                letterSpacing: '1px',
                lineHeight: '2rem',
                "& strong": {
                    paddingRight: '10px',
                    fontSize: '20px',
                    letterSpacing: '2px'
                }
            }
        },
        "& p": {
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 600,
            padding: '10px 0'
        }
    },
    logo: {
        fontFamily: "'Knewave', cursive",
        fontSize: '25px',
        letterSpacing: '4px'
    },
    version: {
        fontSize: '18px',
        paddingLeft: '10px',
        "& span": {
            backgroundColor: '#fff',
            color: '#000',
            padding: '5px',
            paddingLeft: '6px',
            fontSize: '10px',
            borderRadius: '14px',
            textAlign: 'center'
        } 
    },
    styledHr: {
        border: 0,
        height: 0,
        borderTop: "1px solid rgba(0, 0, 0, 0.1)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.3)",
    },
    btn: {
        border: 'none',
        backgroundColor: '#fff',
        padding: '10px 20px',
        borderRadius: '15px',
        marginTop: '0.5rem',
        cursor: 'pointer',
        fontFamily: "'Montserrat', sans-serif",
        fontWeight: 600,
        transition: 'all 500ms ease',
        "&:hover": {
            boxShadow: "0px 3px 30px -3px rgba(0, 0, 0, 0.8)",
            WebkitBoxShadow: "0px 3px 30px -3px rgba(0, 0, 0, 0.8)",
            MozBoxShadow: "0px 3px 30px -3px rgba(0, 0, 0, 0.8)",
        }
    }
}));

function GlobalNotification({handleGlobalNotif, showGlobalNotif}) {
    const classes = useStyles();

    useEffect(() => AOS.init(), []);

    return (
        <Backdrop open={showGlobalNotif} onClick={handleGlobalNotif} style={{zIndex: 40}}>
            <Card 
                variant="elevation"
                className={classes.notifCard}
                style={{display: showGlobalNotif ? 'block' : 'none'}}
                data-aos="zoom-in"
                data-aos-duration="800"
            >
                <CardMedia image={globalNotifIllus} component="img" className={classes.cardImg}/>
                <CardContent className={classes.cardContent}>
                    <h1>
                        Welcome to <span className={classes.logo}>Sociedon</span> 
                        <span className={classes.version}>v1.0 <span>beta</span></span>
                    </h1>
                    <hr className={classes.styledHr}/>
                    <h2>Features:</h2>
                    <ul>
                        <li>
                            <strong>Direct Messages:</strong>
                            Find new friends and hangout privately with direct messages.
                        </li>
                        <li>
                            <strong>Live Notifications:</strong>
                            Get notified about new requests, unread messages, user status and much more...
                        </li>
                        <li>
                            <strong>Emoji Support:</strong>
                            Use emojis of your choice in conversations and be more expressive.
                        </li>
                    </ul>
                    <h2>Upcoming updates:</h2>
                    <h3>v1.1</h3>
                    <hr className={classes.styledHr}/>
                    <ul>
                        <li>
                            <strong>Arenas:</strong>
                            Create or join arenas and find people just like you, explore new stuff and stay connected.
                        </li>
                        <li>
                            <strong>People Near You:</strong>
                            Find people in your area with a simple and interactive UI
                        </li>
                        <li>
                            <strong>GIF Support.</strong>
                        </li>
                    </ul>
                    <h3>v1.5</h3>
                    <hr className={classes.styledHr}/>
                    <ul>
                        <li>
                            <strong>File Sharing:</strong>
                            Share things that matter to you: pictures, links, files and much more, with friends.
                        </li>
                    </ul>
                    <h3>v2.0</h3>
                    <hr className={classes.styledHr}/>
                    <ul>
                        <li>
                            <strong>Voice and Video Calls:</strong>
                            More fun ways to chat with Sociedon Meets.
                        </li>
                    </ul>
                    <p>Stay Tuned! 😉</p>
                    <button className={classes.btn} onClick={handleGlobalNotif}>Close</button>
                </CardContent>
            </Card>
        </Backdrop>
    )
}

export default GlobalNotification;