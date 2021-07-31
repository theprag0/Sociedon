import React, { useContext, useRef, useEffect, useState } from 'react';
import { MessengerContext } from '../../contexts/messenger.context';
import MessageInput from './MessageInput';
import getDefaultPicture from '../../helpers/getDefaultPicture';
import '../../styles/Chatbox.css';

function Chatbox(props) {
    const {chatboxUser} = useContext(MessengerContext);
    const friendImgSrc = chatboxUser.defaultImage ? getDefaultPicture(chatboxUser.defaultImage) : chatboxUser.image;
    const [isScrolling, setIsScrolling] = useState(false);

    const msgEndRef = useRef(null);
    useEffect(() => {
        msgEndRef.current.scrollIntoView({behavior: 'smooth'});
    }, []);

    // Show scrollbar only when scroll event occurs
    const handleScroll = e => {
        setIsScrolling(true);
        setTimeout(() => {
            setIsScrolling(false);
        }, 4000);
    }

    return (
        <section className="Chatbox">
            <section className="messages">
                <div className="chatbox-header">
                    <div className="user-info">
                        <div className="img-container">
                            <img 
                                className="user-avatar" 
                                src={friendImgSrc}
                                alt="user avatar"
                            />
                            <p className={chatboxUser.status === 'offline' ? 'offline' : 'online'}></p>
                        </div>
                        <span>
                            <h1>{chatboxUser.username}</h1>
                            <p>{chatboxUser.status === 'online' ? 'Active Now' : ''}</p>
                        </span>
                    </div>
                    <div className="icons">
                        <i className="fas fa-phone-alt"></i>
                        <i className="fas fa-video"></i>
                        <i className="fas fa-ellipsis-v"></i>
                    </div>
                </div>
                <ul className={`message-list ${isScrolling ? 'scroll-list' : ''}`} onScroll={handleScroll}>
                    <span>
                        <img style={{borderRadius: '50%'}} src={friendImgSrc} alt="profile pic" className="img-container"/>
                        <li className="they">
                            Hello
                        </li>
                    </span>
                    <li className="me">hi</li>
                    <span>
                        <img style={{borderRadius: '50%'}} src={friendImgSrc} alt="profile pic" className="img-container"/>
                        <li className="they">
                            Hey
                        </li>
                    </span>
                    <li className="me">sheesh</li>
                    <div ref={msgEndRef}/>
                </ul>
            </section>
            <MessageInput />
        </section>
    )
}

export default Chatbox;