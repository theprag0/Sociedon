import React from 'react';
import { NavLink } from 'react-router-dom';

function HomeNavbar(props) {
    return(
        <nav>
            <NavLink exact to='/login'>Login</NavLink>
            <NavLink exact to='/register'>Sign Up</NavLink>
        </nav>
    );
}   

export default HomeNavbar;