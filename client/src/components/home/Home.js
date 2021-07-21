import React, { useEffect, useRef } from 'react';
import HomeNavbar from './HomeNavbar';
import Alert from '../utility/Alert';

function Home({history}) {
    let popupMsg = useRef(null);

    useEffect(() => {
        popupMsg.current = history.location.state ? history.location.state.message : null;
        history.replace({...history.location, state: undefined});
    }, [history]);

    return(
        <React.Fragment>
            <HomeNavbar />
            {popupMsg.current !== null ? <Alert message={popupMsg.current} type="warning"/> : null}
            <h1>Welcome to Sociedon!</h1>
        </React.Fragment>
    );
}

export default Home;