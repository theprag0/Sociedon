import React, { useContext } from 'react';
import { MessengerContext } from '../../../contexts/messenger.context';
import getDefaultPicture from '../../../helpers/getDefaultPicture';
import multimediaIllustration2 from '../../../assets/svg/multimedia-illus-2.svg';

function ChatboxInfobar({userData}) {
    const {chatboxUser} = useContext(MessengerContext);
    return (
        <>
            <h1 className="chatbox-infobar-headings" style={{paddingBottom: '0.5rem'}}>Members - 2</h1>
            <div className="chatbox-profile-pictures">
                <span>
                    <img src={getDefaultPicture(userData.defaultImage)} alt="user profile pic"/>
                    <p>You</p>
                </span>
                <img 
                    src={chatboxUser && chatboxUser.defaultImage ? getDefaultPicture(chatboxUser.defaultImage) : ''} 
                    alt="friend profile pic"
                />
            </div>
            <hr className="Infobar-hr"/>
            <div className="multimedia">
                <h1 className="chatbox-infobar-headings">Photos & Multimedia</h1>
                <img src={multimediaIllustration2}/>
                <p>Start sharing images and videos 🤳</p>
                <button className="view-all">View All</button>
            </div>
            <hr className="Infobar-hr"/>
            <div className="attachments">
                <h1 className="chatbox-infobar-headings">Attachments</h1>
                <p>No attachments found 📎</p>
                <button className="view-all">View All</button>
            </div>
        </>
    );
}

export default ChatboxInfobar;