import React, { useContext } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { AuthenticationContext } from './contexts/auth.context';
import Loader from './components/utility/Loader';

function PrivateRoute({component: Component, redirectPath, ...rest}) {
    const {isAuthenticated, userLoading} = useContext(AuthenticationContext);
    let renderComponent = routeProps => {
        if(userLoading && !isAuthenticated) {
            return <Loader />;
        } else if(isAuthenticated) {
            return <Component {...routeProps}/>
        } else {
            return <Redirect exact to={
                {
                    pathname: redirectPath, 
                    state: {
                        from: routeProps.location, 
                        message: "You're not allowed to view this page! Please login or signup to continue",
                        type: 'privateRoute'
                    }
                }
            } />
        }
    };
    return (
        <Route 
            {...rest}
            render={routeProps => (
                renderComponent(routeProps)
            )}
        />
    );
}

export default PrivateRoute;