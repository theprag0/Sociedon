import React, { useContext } from 'react';
import { MessengerContext } from '../../contexts/messenger.context';
import getDefaultPicture from '../../helpers/getDefaultPicture';
import '../../styles/Chatbox.css';

function Chatbox(props) {
    const {chatboxUser} = useContext(MessengerContext);

    return (
        <section className="Chatbox">
            <section className="messages">
                <div className="chatbox-header">
                    <div className="user-info">
                        <div className="img-container">
                            <img 
                                className="user-avatar" 
                                src={chatboxUser.defaultImage ? getDefaultPicture(chatboxUser.defaultImage) : chatboxUser.image}
                                alt="user avatar"
                            />
                            <p className={chatboxUser.status === 'offline' ? 'offline' : 'online'}></p>
                        </div>
                        <span>
                            <h1>{chatboxUser.username}</h1>
                            <p>{chatboxUser.status === 'online' ? 'Active Now' : ''}</p>
                        </span>
                    </div>
                    <div className="icons"></div>
                </div>
                <ul className="message-list">
                    <li className="they">Hello</li>
                    <li className="me">hi</li>
                    <li className="they">hey</li>
                    <li className="me">sheesh</li>
                </ul>
            </section>
            <section className="message-input">
                <input 
                    type="text"
                    placeholder="Type your message..."
                />
            </section>
        </section>
    )
}

export default Chatbox;