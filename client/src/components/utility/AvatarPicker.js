import React from 'react';
import FormGroup from '@material-ui/core/FormGroup';
import Button from '@material-ui/core/Button';
import ImageList from '@material-ui/core/ImageList';
import ImageListItem from '@material-ui/core/ImageListItem';
import Slide from '@material-ui/core/Slide';
import { avatars } from '../../helpers/getAvatar';
import useStyles from '../../styles/RegisterStyles';

function AvatarPicker({setAvatar, avatar, activeStep}) {
    const classes = useStyles();

    const handleAvatarClick = e => {
        if(avatar === e.currentTarget.title) {
            setAvatar('');
        } else {
            setAvatar(e.currentTarget.title);
        }
    }

    return (
        <Slide direction="right" in={activeStep === 1} timeout={600}>
            <FormGroup className={classes.imageListRoot}>
                <ImageList rowHeight={80} cols={5} className={classes.imageList}>
                    {avatars.map(avt => (
                        <ImageListItem key={avt.ref} col={1}>
                            <span 
                                className={classes.selectedIcon} 
                                style={{display: avatar && avatar === avt.ref ? 'block' : 'none'}}
                            >
                                &#10004;
                            </span>
                            <img 
                                src={avt.image} 
                                alt={`user avatar: ${avt.ref}`} 
                                title={avt.ref}
                                onClick={handleAvatarClick}
                                className={avatar && avatar === avt.ref ? classes.selectedAvatar : ''}
                            />
                        </ImageListItem>
                    ))}
                </ImageList>
                <div className={classes.uploadAvatar}>
                    <p>
                        <span>
                            Or
                        </span>
                    </p>
                    <Button
                        variant="contained"
                        size="small"
                        className={classes.btn}
                        style={{marginTop: 0, padding: '4px', backgroundColor: '#f95959'}}
                    >
                        Upload Image
                        <input
                            type="file"
                            hidden
                        />
                    </Button>
                </div>
            </FormGroup>
        </Slide>
    );
}

export default AvatarPicker;