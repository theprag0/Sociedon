import React, { useContext, useRef, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { MessengerContext } from '../../contexts/messenger.context';
import { SocketContext } from '../../contexts/socket.context';
import MessageInput from './MessageInput';
import getDefaultPicture from '../../helpers/getDefaultPicture';
import '../../styles/Chatbox.css';
import chatbox1 from '../../assets/svg/chatbox1.svg';

function Chatbox({userId}) {
    const {chatboxUser, setChatboxUser, chatboxLoading} = useContext(MessengerContext);
    const {socket} = useContext(SocketContext);
    const [isScrolling, setIsScrolling] = useState(false);

    const friendImgSrc = chatboxUser.defaultImage ? getDefaultPicture(chatboxUser.defaultImage) : chatboxUser.image;

    const msgEndRef = useRef(null);
    useEffect(() => {
        msgEndRef.current.scrollIntoView({behavior: 'smooth'});
    }, [chatboxUser.messages]);

    // Show scrollbar only when scroll event occurs
    const handleScroll = e => {
        setIsScrolling(true);
        setTimeout(() => {
            setIsScrolling(false);
        }, 4000);
    }

    // Add new message
    const addMessage = msg => {
        socket.emit('private message', msg);
        setChatboxUser(currChatboxUser => (
            {...currChatboxUser, messages: [...currChatboxUser.messages, msg]}
        ));
    }
    useEffect(() => {
        if(socket !== null) {
            socket.on('private message', data => {
                setChatboxUser(currChatboxUser => (
                    {...currChatboxUser, messages: [...currChatboxUser.messages, data]}
                ));
            });
        }

        return () => socket.off('private message');
    }, []);

    // Show skeleton layout when chatbox is loading
    const loadingList = Array.from({length: 10}, (_, i) => {
        if(i % 2 === 0) {
            return <li key={i} className="loading-list me gradient"></li>
        }
        return <li key={i} className="loading-list they gradient"></li>
    });

    return (
        <section className="Chatbox">
            <section className="messages">
                <div className="chatbox-header">
                    <div className="user-info">
                        <div className={`img-container ${chatboxLoading ? 'img-loading gradient' : ''}`}>
                            {
                                !chatboxLoading ?
                                (
                                    <>
                                        <img 
                                            className="user-avatar" 
                                            src={friendImgSrc}
                                            alt="user avatar"
                                        />
                                        <p className={chatboxUser.status === 'offline' ? 'offline' : 'online'}></p>
                                    </>
                                ) : ''
                            }
                        </div>
                        <span className={chatboxLoading ? 'user-loading gradient' : ''}>
                            {
                                !chatboxLoading ?
                                (
                                    <>
                                        <h1>{chatboxUser.username}</h1>
                                        <p>{chatboxUser.status === 'online' ? 'Active Now' : ''}</p>
                                    </>
                                ) : ''
                            }
                        </span>
                    </div>
                    <div className="icons">
                        <i className="fas fa-phone-alt"></i>
                        <i className="fas fa-video"></i>
                        <i className="fas fa-ellipsis-v"></i>
                    </div>
                </div>
                {
                    !chatboxLoading ?
                    <ul className={`message-list ${isScrolling ? 'scroll-list' : ''}`} onScroll={handleScroll}>
                        {
                            (chatboxUser.messages && chatboxUser.messages.length > 0) ?
                            chatboxUser.messages.map(m => {
                                if(m.from === userId) {
                                    return (
                                        <li key={m._id ? m._id : uuidv4()} className="me">
                                            {m.message}
                                        </li>
                                    );
                                } 
                                return (
                                    <span key={m._id ? m._id : uuidv4()}>
                                        <img style={{borderRadius: '50%'}} src={friendImgSrc} alt="profile pic" className="img-container"/>
                                        <li className="they">
                                            {m.message}
                                        </li>
                                    </span>
                                )
                            })
                            : (
                                <div className="start-chat">
                                    <img src={chatbox1} alt="start chatting illustration"/>
                                    <p>Start chatting with {chatboxUser.username}</p>
                                    <hr className="hr-one"/>
                                    <li><em>Say 'Hi'</em> 👋...</li>
                                </div>
                            )
                        }
                        <div ref={msgEndRef}/>
                    </ul>
                    :
                    <ul className="message-list">
                        {loadingList}
                        <div ref={msgEndRef}/>
                    </ul>
                }
            </section>
            <MessageInput 
                addMessage={addMessage}
                userId={userId}
            />
        </section>
    )
}

export default Chatbox;