import React, { useState } from 'react';
import Popover from '@material-ui/core/Popover';
import Logout from '../../auth/Logout';
import '../../../styles/Sidebar.css';

function SidebarPanel(props) {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
      };
    
    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    return (
        <div className="SidebarPanel">
            <div className="Sociedon-Logo"></div>
            <div className="filler"></div>
            <div className="arena-icons"></div>
            <div className="Utility-icons">
                <button onClick={handleClick} className="settings-icon">    
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
    )
}

export default SidebarPanel;