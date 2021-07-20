import React, { useContext } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { AuthenticationContext } from './contexts/auth.context';

function PrivateRoute({component: Component, redirectPath, ...rest}) {
    const {isAuthenticated} = useContext(AuthenticationContext);
    console.log(redirectPath);
    return (
        <Route 
            {...rest}
            render={routeProps => (
                isAuthenticated ? (
                    <Component {...routeProps}/>
                ) : (
                    <Redirect to={
                        {
                            pathname: redirectPath, 
                            state: {
                                from: routeProps.location, 
                                message: "You're not allowed to view this page! Please login or signup to continue"
                            }
                        }
                    } />
                )
            )}
        />
    );
}

export default PrivateRoute;