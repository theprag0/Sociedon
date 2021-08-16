import React, { useState } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import Slide from '@material-ui/core/Slide';
import alertHelper from '../../helpers/alertHelper';
import '../../styles/Util.css';

export const withSnackbar = WrappedComponent => {
    return props => {
      const [open, setOpen] = useState(false);
      const [message, setMessage] = useState("I'm a custom snackbar");
      const [duration, setDuration] = useState(5000);
      const [type, setType] = useState(
        {}
      ); /** error | warning | info */
  
      const showMessage = (message, alertType, duration = 5000) => {
        setMessage(message);
        setType(alertHelper(alertType));
        setDuration(duration);
        setOpen(true);
      };
  
      const handleClose = (event, reason) => {
        if (reason === "clickaway") {
          return;
        }
        setOpen(false);
      };
  
      return (
        <>
          <WrappedComponent {...props} snackbarShowMessage={showMessage} />
          <Snackbar
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left"
            }}
            autoHideDuration={duration}
            open={open}
            onClose={handleClose}
            TransitionComponent={Slide}
          >
            <SnackbarContent 
                style={{
                    background: '#fff', 
                    border: '3px solid #F95959',
                    fontFamily: "Rubik",
                    fontWeight: "500"
                }}
                message={
                    <span style={{display: 'flex', alignItems: 'center'}}>
                        {(type && type.iconClass) ? 
                            <i className={type.iconClass} style={{color: type.color, marginRight: '1rem'}}></i>
                            : null
                        }
                        <p style={{color: '#000', marginRight: '0.5rem', paddingBottom: 0}}>{message}</p>
                        {(type && type.emoji) ? type.emoji : null}
                    </span>
                }
            />
          </Snackbar>
        </>
      );
    };
  };