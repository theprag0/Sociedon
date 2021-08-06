import React, { useContext, useRef, useEffect, useState } from 'react';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import { MessengerContext } from '../../contexts/messenger.context';
import { SocketContext } from '../../contexts/socket.context';
import MessageInput from './MessageInput';
import getDefaultPicture from '../../helpers/getDefaultPicture';
import '../../styles/Chatbox.css';
import chatbox2 from '../../assets/svg/chatbox2.svg';

function Chatbox({userId}) {
    const {chatboxUser, setChatboxUser, chatboxLoading, conversations, setConversations, currentBody} = useContext(MessengerContext);
    const {socket} = useContext(SocketContext);
    const [isScrolling, setIsScrolling] = useState(false);

    const friendImgSrc = chatboxUser.defaultImage ? getDefaultPicture(chatboxUser.defaultImage) : chatboxUser.image;

    const msgEndRef = useRef(null);
    const chatboxUserId = useRef(null);
    useEffect(() => {
        chatboxUserId.current = chatboxUser._id;
        let scrollTimer = setTimeout(() => {
            msgEndRef.current.scrollIntoView({behavior: 'smooth'});
        }, 50);

        return () => clearTimeout(scrollTimer);
    }, [chatboxUser]);

    // Show scrollbar only when scroll event occurs
    const handleScroll = e => {
        setIsScrolling(true);
        setTimeout(() => {
            setIsScrolling(false);
        }, 4000);
    }

    // Add new message
    const addMessage = msg => {
        const newMsg = {...msg, status: 'sending', tempId: uuidv4()};
        const msgDate = moment(newMsg.timestamp).format('DD-MM-YYYY');
        
        setChatboxUser(currChatboxUser => {
            // Check if this is the first message in current DM
            if(currChatboxUser.messages && Object.keys(currChatboxUser.messages).length === 0) {
                setConversations(currConvo => {
                    const newConversation = {
                        _id: currChatboxUser._id,
                        defaultImage: currChatboxUser.defaultImage,
                        status: currChatboxUser.status,
                        username: currChatboxUser.username
                    }
                    return [...currConvo, newConversation];
                });
            }
            const messages = {...currChatboxUser.messages};
            if(!messages[msgDate]) {
                messages[msgDate] = [newMsg];
            } else {
                messages[msgDate].push(newMsg);
            }
            return {...currChatboxUser, messages};
        });
    
        socket.emit('private message', newMsg, res => {
            if(res) {
                setChatboxUser(currChatboxUser => {
                    const updateMessageStatus = currChatboxUser.messages[msgDate].map(message => {
                        if(message.tempId && res.msg.tempId === message.tempId) {
                            return {...message, status: res.msg.status}
                        }
                        return message;
                    });
                    const messages = {...currChatboxUser.messages};
                    messages[msgDate] = updateMessageStatus;
                    return {...currChatboxUser, messages};
                });
            }
        });
    }

    useEffect(() => {
        if(socket !== null) {
            socket.on('private message', data => {
                const msgDate = moment(data.timestamp).format('DD-MM-YYYY');
                if(data.from === chatboxUserId.current) {
                    setChatboxUser(currChatboxUser => {
                        const messages = {...currChatboxUser.messages};
                        if(!messages[msgDate]) {
                            messages[msgDate] = [data];
                        } else {
                            messages[msgDate].push(data);
                        }
                        return {...currChatboxUser, messages};
                    });
                } 
            });
        }

        return () => socket.off('private message');
    }, [socket]);

    //Determine the last seen message
    const lastSeenMessageId = useRef(null);
    useEffect(() => {
        if(chatboxUser.messages && Object.keys(chatboxUser.messages).length > 0) {
            const messageDates = Object.keys(chatboxUser.messages);
            const recentMessageArray = chatboxUser.messages[messageDates[messageDates.length - 1]]
            for (let i = recentMessageArray.length - 1; i >= 0; i--) {
                let currMessage = recentMessageArray[i];
                if(currMessage.from === chatboxUser._id) {
                    lastSeenMessageId.current = currMessage._id;
                    socket.emit('last-seen message', {
                        messageId: lastSeenMessageId.current,
                        by: userId,
                        from: chatboxUserId.current
                    });
                    if(conversations && conversations.length > 0) {
                        setConversations(currConvo => {
                            const updateConversations = currConvo.map(c => {
                                if(c._id === chatboxUserId.current && c.lastMessageFromFriend && c.lastMessageFromFriend._id === lastSeenMessageId.current) {
                                    return {...c, lastMessageFromFriend: null, unreadMessages: null};
                                }
                                return c;
                            });
                            return updateConversations;
                        });
                    }
                    break;
                }
            }
        }

        // emit last seen message to server on unmount
        return () => {
            if(socket !== null && lastSeenMessageId.current !== null) {
                socket.emit('last-seen message', {
                    messageId: lastSeenMessageId.current,
                    by: userId,
                    from: chatboxUserId.current
                });
            }
        }
    }, [chatboxUser.messages])

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
                            (chatboxUser && Object.keys(chatboxUser.messages).length > 0) ?
                            Object.keys(chatboxUser.messages).map(date => {
                                return (
                                    <React.Fragment key={date}>
                                        <h1 className="chat-date"><span>{date}</span></h1>
                                        {chatboxUser.messages[date].map(m => {
                                            if(m.from === userId) {
                                                return (
                                                    <React.Fragment key={m._id ? m._id : uuidv4()}>
                                                        <li className={`me ${m.status === 'sending' ? 'sending' : ''}`} style={{marginBottom: 0}}>
                                                            {m.message}
                                                        </li>
                                                        <p style={{alignSelf: 'flex-end'}} className="message-status">
                                                            {moment(m.timestamp).format('hh:mm')}
                                                            {
                                                                m.status === 'sending' ?
                                                                <i className="fas fa-clock"></i>
                                                                : <i className="fas fa-check"></i>
                                                            }
                                                        </p>
                                                    </React.Fragment>
                                                );
                                            } 
                                            return (
                                                <span key={m._id ? m._id : uuidv4()}>
                                                    <img style={{borderRadius: '50%'}} src={friendImgSrc} alt="profile pic" className="img-container"/>
                                                    <li className="they">
                                                        {m.message}
                                                    </li>
                                                </span>
                                            );
                                        })}
                                    </React.Fragment>
                                )
                            }) : (
                                <div className="start-chat">
                                    <img src={chatbox2} alt="start chatting illustration"/>
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
    );
}

export default Chatbox;