import React, { useEffect } from 'react';
//import { Redirect } from 'react-router-dom';
//import { AuthenticationContext } from '../../contexts/auth.context';

function Messenger(props) {
    //const {isAuthenticated} = useContext(AuthenticationContext);

    useEffect(() => {
        // if(!isAuthenticated) {
        //     return <Redirect to="/"/>
        // }
    });
    // if(!isAuthenticated) {
    //     return <Redirect to="/"/>
    // }

    return (
        <h1>Messenger</h1>
    );
}

export default Messenger;