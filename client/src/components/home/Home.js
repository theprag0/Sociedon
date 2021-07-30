import React, { useEffect, useState } from 'react';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import HomeNavbar from './HomeNavbar';
import { makeStyles } from '@material-ui/core/styles';
import { withSnackbar } from '../utility/SnackbarHOC';

const useStyles = makeStyles((theme) => ({
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
}));

function Home({history, snackbarShowMessage}) {
    const [modalOpen, setModalOpen] = useState(false);
    const classes = useStyles();
    useEffect(() => {
        if(history.location.state) {
            snackbarShowMessage(`${history.location.state.message} 🦍`, 'error', 6000);
            setModalOpen(true);
        }
        history.replace({...history.location, state: undefined});
    }, [history]);

    const handleModalClose = () => {
        setModalOpen(false);
    };

    return(
        <React.Fragment>
            <HomeNavbar />
            <h1>Welcome to Sociedon!</h1>

            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={modalOpen}
                onClose={handleModalClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={modalOpen}>
                    <iframe 
                        width="560" 
                        height="315" 
                        src="https://www.youtube.com/embed/Z-Frah8fcfo?&autoplay=1" 
                        title="YouTube video player" 
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen
                    ></iframe>
                </Fade>
            </Modal>
        </React.Fragment>
    );
}

export default withSnackbar(Home);