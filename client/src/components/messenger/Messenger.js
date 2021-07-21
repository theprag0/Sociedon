import React, { useEffect, useRef } from 'react';
import Logout from '../auth/Logout';
import Alert from '../utility/Alert';
import io from 'socket.io-client';

function Messenger({history}) {
    const popupMsg = useRef(null);

    useEffect(() => {
        popupMsg.current = history.location.state ? history.location.state.message : null;
        history.replace({...history.location, state: undefined});
    }, [history]);

    return (
        <div>
            <Logout />
            {popupMsg.current !== null ? <Alert message={popupMsg.current} type="success"/> : null}
            <h1>Messenger</h1>
        </div>
    );
}

export default Messenger;