import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // this one loads tokens from the local storage we used to store them tokens
    useEffect(() => {
        const savedToken = localStorage.getItem('authToken');
        const savedUser = localStorage.getItem('user');
        
        if (savedToken && savedUser) {
            setToken(savedToken);
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    //this hadlers registering ofthe users handlers user token assignment and other verifications (son tobe modified)
    const register = async (name, email, password, phone = '') => {
        try {
            setError(null);
            const response = await fetch('http://localhost:3000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, phone })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Registration failed');
            }

            setToken(data.token);
            setUser(data.user);
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            return data;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    //just like login this handels login logic and tokenizaton it checks each user assigned token then logsin the user 
    const login = async (email, password) => {
        try {
            setError(null);
            const response = await fetch('http://localhost:3000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Login failed');
            }

            setToken(data.token);
            setUser(data.user);
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            return data;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    //handels logout 
    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
    };

    //handel update for the profile edits the stored data from the databse 
    const updateProfile = async (updates) => {
        try {
            setError(null);
            const response = await fetch('http://localhost:3000/api/auth/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updates)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Update failed');
            }

            setUser(data.user);
            localStorage.setItem('user', JSON.stringify(data.user));

            return data;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            token,
            loading,
            error,
            register,
            login,
            logout,
            updateProfile,
            isAuthenticated: !!token
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
