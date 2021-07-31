import React, { useContext } from 'react';
import { MessengerContext } from '../../contexts/messenger.context';
import MessageInput from './MessageInput';
import getDefaultPicture from '../../helpers/getDefaultPicture';
import '../../styles/Chatbox.css';

function Chatbox(props) {
    const {chatboxUser} = useContext(MessengerContext);
    const friendImgSrc = chatboxUser.defaultImage ? getDefaultPicture(chatboxUser.defaultImage) : chatboxUser.image;

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
                        <i class="fas fa-phone-alt"></i>
                        <i class="fas fa-video"></i>
                        <i class="fas fa-ellipsis-v"></i>
                    </div>
                </div>
                <ul className="message-list">
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
                </ul>
            </section>
            <MessageInput />
        </section>
    )
}

export default Chatbox;