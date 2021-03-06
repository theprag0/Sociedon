import React, { useEffect, useState, useContext, useRef } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import { AuthenticationContext } from '../../contexts/auth.context';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import HomeNavbar from './HomeNavbar';
import VideoModal from '../utility/VideoModal';
import { withSnackbar } from '../utility/SnackbarHOC';
import 'aos/dist/aos.css';
import dmIllus from '../../assets/images/dm-section.webp';
import arenaIllus from '../../assets/images/arena-bg.png';
import fileSharingIllus from '../../assets/images/home-file-sharing-illus.jpg';
import callsIllus from '../../assets/images/home-calls-illus.jpg';
import bmcBtn from '../../assets/images/yellow-button.png';

function Home({history, snackbarShowMessage}) {
    const {isAuthenticated, userData} = useContext(AuthenticationContext);
    const [modalOpen, setModalOpen] = useState(false);
    const [navState, setNavState] = useState("initial");
    
    useEffect(() => {
        if(history.location.state && history.location.state.type === 'privateRoute') {
            snackbarShowMessage(`${history.location.state.message} 🦍`, 'error', 6000);
            setModalOpen(true);
        } else if(history.location.state) {
            snackbarShowMessage(history.location.state.message, history.location.state.type);
        }
        history.replace({...history.location, state: undefined});
    }, [history]);

    // Initialize AOS-lib
    useEffect(() => AOS.init(), []);

    // Change nav color on scroll
    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    const handleScroll = e => {
        if(window.scrollY > 100) setNavState("scrolled");
        else setNavState('initial');
    }

    const landingRef = useRef(null);
    const featuresRef = useRef(null);
    const scrollToView = e => {
        if(e.currentTarget.title === 'landing') {
            landingRef.current.scrollIntoView({behavior: 'smooth'});
        } else if(e.currentTarget.title === 'features') {
            featuresRef.current.scrollIntoView({behavior: 'smooth'});
        }
    }

    const handleModalClose = () => {
        setModalOpen(false);
    };

    return(
        <div className="Home">
            <HomeNavbar navState={navState} scrollToView={scrollToView}/>
            <section className="home-landing" id="home-landing" ref={landingRef}>
                <div className="gradient-overlay"></div>
                <div className="landing-desc">
                    <h1>Be Awesome!</h1>
                    <p>
                        Connect and hangout with your friends and meet people just like you quickly and efficiently.
                        Share the things that matter to you and leave it on the cloud. Meet people just like you...
                    </p>
                </div>
                <div className="landing-links">
                    {
                        isAuthenticated && userData
                        ? <Link to={`/messenger/${userData.userId}`}>Start Chatting</Link>
                        : <Link to="/register">Get Started</Link>
                    }
                    <button onClick={scrollToView} title="features">Learn More</button>
                </div>
                <div className="arrow-down">
                    <button title="features" onClick={scrollToView}>
                        <i className="fas fa-chevron-down fa-2x"></i>
                    </button>
                </div>
            </section>
            <section className="features" id="features" ref={featuresRef}>
                <div className="direct-messages">
                    <img src={dmIllus} alt="direct messages"/>
                    <Card 
                        variant="outlined" 
                        className="info-card" 
                        style={{border: '4px solid #4849a1', borderRadius: '15px'}}
                        data-aos="fade-up-left"
                        data-aos-duration="1000"
                        data-aos-offset="300"
                    >
                        <CardContent>
                            <h1 className="card-header">Relax! Have Fun!</h1>
                            <p className="card-desc">
                                Find new friends and start hanging out privately with direct messages. 😺
                            </p>
                        </CardContent>
                    </Card>
                </div>
                <div className="arenas">
                    <Card
                        variant="outlined" 
                        className="info-card" 
                        style={{border: '4px solid #f95959', borderRadius: '15px', width: '37%'}}
                        data-aos="fade-up-right"
                        data-aos-duration="1000"
                    >
                        <CardContent>
                            <h1 className="card-header">Meet people just like you</h1>
                            <p className="card-desc">Create or join Arenas and stay connected with people just like you. 🙌</p>
                        </CardContent>
                    </Card>
                    <img src={arenaIllus} alt="create arenas"/>
                </div>
                <div className="feature-group">
                    <Card
                        variant="elevation" 
                        className="info-card" 
                        style={{width: '40%', padding: 0, backgroundColor: '#854ABB', border: 'none', borderRadius: '15px'}}
                        data-aos="fade-up-right"
                        data-aos-duration="1000"
                    >
                        <CardMedia 
                            component="img" 
                            image={fileSharingIllus} 
                            className="card-img"
                        />
                        <CardContent style={{padding: '1rem'}}>
                            <h1 className="card-header" style={{fontSize: '2.6rem', color: '#fff'}}>
                                Ooh la la, File Sharing!
                            </h1>
                            <p className="card-desc" style={{fontSize: '1.5rem', color: '#fff'}}>
                                Share the things that matter to you: pictures, links, music, places, funny moments. 📮
                            </p>
                        </CardContent>
                    </Card>
                    <Card
                        variant="outlined" 
                        className="info-card" 
                        style={{border: 'none', borderRadius: '15px', width: '40%', padding: 0, backgroundColor: '#D43B59'}}
                        data-aos="fade-up-left"
                        data-aos-duration="1000"
                    >
                        <CardMedia component="img" image={callsIllus} className="card-img"/>
                        <CardContent style={{padding: '1rem'}}>
                            <h1 className="card-header" style={{fontSize: '2.6rem', color: '#fff'}}>
                                More fun ways to hangout!
                            </h1>
                            <p className="card-desc" style={{fontSize: '1.4rem', color: '#fff'}}>
                                Create or join sociedon meets to stay connect with people, face to face and share your thoughts 🤖
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </section>
            <footer className="home-footer">
                <div className="footer-info">
                    <div className="footer-tagline">
                        <h1>Be Awesome!</h1>
                    </div>
                    <div className="quick-links">
                        <p>Quick Links:</p>
                        <button title="landing" onClick={scrollToView}>Home</button>
                        {
                            isAuthenticated && userData
                            ? (
                                <>
                                    <Link to={`/messenger/${userData.userId}`}>Open Sociedon</Link>
                                    <Link to="/logout">Logout</Link>
                                </>
                            )
                            : (
                                <>
                                    <Link to="/register">Sign Up</Link>
                                    <Link to="/login">Login</Link>
                                </>
                            )
                        }
                    </div>
                    <div className="dev-info">
                        <h1>Contact the <br/> developer:</h1>
                        <a href="mailto: praghadieshnikhil234@gmail.com" target="_blank" rel="noreferrer">Email Me!</a>
                        <div>
                            <a href="https://www.buymeacoffee.com/theprag" target="_blank" className="bmc-btn">
                                <img 
                                    src={bmcBtn}
                                    alt="Buy Me A Coffee" 
                                    style={{height: '60px !important', width: '217px !important', borderRadius: '14px'}} 
                                />
                            </a>
                        </div>
                        <div className="social-media">
                            <a href="https://github.com/theprag0/Sociedon" target="_blank" className="github-icon" rel="noreferrer">
                                <i className="fab fa-github"></i>
                            </a>
                            <a href="https://www.linkedin.com/in/praghadiesh-saravanan-45b876198/" target="_blank" className="linkedin-icon" rel="noreferrer">
                                <i className="fab fa-linkedin"></i>
                            </a>
                            <a href="https://www.facebook.com/praghadiesh.nikil/" target="_blank" className="facebook-icon" rel="noreferrer">
                                <i className="fab fa-facebook"></i>
                            </a>
                            <a href="https://www.facebook.com/praghadiesh.nikil/" target="_blank" className="instagram-icon" rel="noreferrer">
                                <i className="fab fa-instagram"></i>
                            </a>
                        </div>
                    </div>
                </div> 
                <hr className="styled-hr"/>
                <div className="footer-logo">
                    <p>
                        &copy; 2021-2022
                        <span> Sociedon.</span>
                    </p>
                    {
                        isAuthenticated && userData
                        ? <Link to={`/messenger/${userData.userId}`}>Open Sociedon</Link>
                        : <Link to="/register">Get Started</Link>
                    }
                </div>
            </footer>
            {
                modalOpen 
                ? <VideoModal 
                    modalOpen={modalOpen}
                    handleModalClose={handleModalClose}
                    videoSrc="https://www.youtube.com/embed/Z-Frah8fcfo?&autoplay=1"
                />
                : null
            }
        </div>
    );
}

export default withSnackbar(Home);