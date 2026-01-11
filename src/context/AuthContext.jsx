import React, { useState, useEffect } from "react";
import { useContext } from "react";


const AuthContext = React.createContext();

export const Authprovider = ({ children} ) => {

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect ( () => {

        const token = localStorage.getItem("token");

        if(token)
        {
            setIsLoggedIn(true);
        }
    });

    const login = (token) => {
        localStorage.setItem("token", token);
        setIsLoggedIn(true);
    }

    const logout = () => {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
    }


    return ( <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
             {children}
           </AuthContext.Provider>);
}


export const useAuth = () => useContext(AuthContext);