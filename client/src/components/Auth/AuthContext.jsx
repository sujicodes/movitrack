import React, { createContext, useState} from "react";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const login = (userData) => {
        setUser(userData);
        sessionStorage.setItem("logged_user", JSON.stringify(userData));
    };

    const logout = () => {
        sessionStorage.removeItem("logged_user");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
