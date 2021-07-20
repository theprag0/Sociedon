import React, { createContext, useState } from 'react';

export const AuthenticationContext = createContext();

export function AuthenticationProvider(props) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    return (
        <AuthenticationContext.Provider value={{isAuthenticated, setIsAuthenticated}}>
            {props.children}
        </AuthenticationContext.Provider>
    )
}