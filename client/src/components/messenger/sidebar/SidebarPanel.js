import React, { useState, useContext } from 'react';
import { MessengerContext } from '../../../contexts/messenger.context';
import Popover from '@material-ui/core/Popover';
import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined';
import { makeStyles } from '@material-ui/core';
import Logout from '../../auth/Logout';
import '../../../styles/Sidebar.css';

const useStyles = makeStyles(theme => ({
    sidebarPanelIcons: {
        color: "#ccc",
        fontSize: "1.7rem",
        backgroundColor: "transparent",
        padding: "10px",
        cursor: "pointer",
        transition: "color 400ms ease-out",
        "&:hover": {
            color: "#fff",
            backgroundColor: "rgba(238, 238, 238, 0.1)",
            transition: "background-color 500ms ease",
            borderRadius: "5px",
        }
    },
    selected: {
        color: "#fff",
        backgroundColor: "rgba(238, 238, 238, 0.1)",
        borderRadius: "5px",
    }
}));

function SidebarPanel(props) {
    const {currentBody, setCurrentBody, setChatboxUser} = useContext(MessengerContext);
    const [anchorEl, setAnchorEl] = useState(null);
    const classes = useStyles();

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    
    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'settings-popover' : undefined;

    const changeMessengerBody = name => e => {
        if(name === 'home-icon') {
            setCurrentBody('home');
            setChatboxUser({});
        }
    }

    return (
        <div className="SidebarPanel">
            <div className="Sociedon-Logo"></div>
            <div className="filler"></div>
            <div className="arena-icons">
                <HomeOutlinedIcon 
                    onClick={changeMessengerBody('home-icon')}
                    className={
                        `
                            ${classes.sidebarPanelIcons} 
                            ${(currentBody && currentBody === 'home') ? classes.selected : ''}
                        `
                    }
                />
            </div>
            <div className="Utility-icons">
                <button onClick={handleClick} className="settings-icon" aria-describedby={id}>    
                    <i className="fas fa-cog settings-icon"></i>
                </button>
                <Popover
                    id={id}
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}
                    transformOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                >
                    <Logout />
                </Popover>
            </div>
        </div>
    );
}

export default SidebarPanel;