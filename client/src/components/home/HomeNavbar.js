import React, { useContext } from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { AuthenticationContext } from '../../contexts/auth.context';
import Logout from '../auth/Logout';
import '../../styles/Home.css';

function HomeNavbar(props) {
    const {isAuthenticated, userData} = useContext(AuthenticationContext);

    return(
        <nav className="home-nav">
            <div className="nav-logo">Sociedon</div>
            <div className="nav-links">
                {(isAuthenticated && userData) ? (
                    <>
                        <Logout currPage="home"/>
                        <NavLink exact to={`/messenger/${userData.userId}`} className="btn-link">Open Sociedon</NavLink>
                    </>
                ) : (
                    <>
                        <NavLink exact to='/login'>Login</NavLink>
                        <NavLink exact to='/register' className="btn-link">Sign Up</NavLink>
                    </>
                )}
            </div>
        </nav>
    );
}   

export default withRouter(HomeNavbar);