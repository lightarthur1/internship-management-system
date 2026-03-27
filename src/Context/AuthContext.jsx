import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const API_BASE_URL = 'http://localhost:5000/api';

const normalizeUser = (userData) => {
    if (!userData) return userData;
    return {
        ...userData,
        // Backwards-compat for existing dashboard code
        name: userData.name || userData.fullName,
    };
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedUser = localStorage.getItem('ims_user');
        const savedToken = localStorage.getItem('ims_token');
        if (savedUser && savedToken) {
            setUser(JSON.parse(savedUser));
            setToken(savedToken);
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const res = await axios.post(`${API_BASE_URL}/auth/login`, {
                email,
                password,
            });

            const { user: userData, token: accessToken } = res.data;
            const normalized = normalizeUser(userData);
            setUser(normalized);
            setToken(accessToken);
            localStorage.setItem('ims_user', JSON.stringify(normalized));
            localStorage.setItem('ims_token', accessToken);
            return normalized;
        } catch (error) {
            console.error('Login failed', error);
            throw error;
        }
    };

    const signup = async ({ name, email, password, role }) => {
        try {
            const res = await axios.post(`${API_BASE_URL}/auth/signup`, {
                fullName: name,
                email,
                password,
                role,
            });

            const { user: userData, token: accessToken } = res.data;
            const normalized = normalizeUser(userData);
            setUser(normalized);
            setToken(accessToken);
            localStorage.setItem('ims_user', JSON.stringify(normalized));
            localStorage.setItem('ims_token', accessToken);
            return normalized;
        } catch (error) {
            console.error('Signup failed', error);
            throw error;
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('ims_user');
        localStorage.removeItem('ims_token');
    };

    const value = {
        user,
        token,
        login,
        signup,
        logout,
        loading,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
