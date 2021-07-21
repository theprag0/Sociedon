import React, { useState } from 'react';
import alertHelper from '../../helpers/alertHelper';
import '../../styles/Util.css';

function Alert({message, type}) {
    const [isOpen, setIsOpen] = useState(true);
    const [messageDisplay, setMessageDisplay] = useState('none');
    const {iconClass, id, color} = alertHelper(type);
    
    setTimeout(() => {
        setIsOpen(false);
    }, 5000);

    const displayMessage = async e => {
        if (e.animationName === 'fill-in') {
            setMessageDisplay('inline-block');
        }
    }

    return (
        <div className={`Alert ${isOpen ? 'open-alert' : 'close-alert'}`} onAnimationEnd={displayMessage}>
            <i className={iconClass} style={{display: messageDisplay, color}} id={id}></i>
            <p style={{display: messageDisplay}}>{message}</p>
        </div>
    );
}

export default Alert;