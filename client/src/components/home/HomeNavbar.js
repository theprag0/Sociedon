import React, { useContext } from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { AuthenticationContext } from '../../contexts/auth.context';
import Logout from '../auth/Logout';

function HomeNavbar(props) {
    const {isAuthenticated, user} = useContext(AuthenticationContext);

    return(
        <nav>
            {(isAuthenticated && user) ? (
                <>
                    <Logout />
                    <NavLink exact to={`/messenger/${user.id}`}>Open Sociedon</NavLink>
                </>
            ) : (
                <>
                    <NavLink exact to='/login'>Login</NavLink>
                    <NavLink exact to='/register'>Sign Up</NavLink>
                </>
            )}
        </nav>
    );
}   

export default withRouter(HomeNavbar);