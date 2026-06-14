import React, { createContext, useState, useEffect } from 'react';
import { loginUser, registerUser } from '../api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const login = async (email, password) => {
        const data = await loginUser(email, password);
        setUser(data);
    };

    const register = async (email, password) => {
        const data = await registerUser(email, password);
        setUser(data);
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
