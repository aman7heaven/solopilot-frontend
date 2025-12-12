import React, { createContext, useState, useCallback } from 'react';
import api from '../api';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem('sp_token');
        return stored ? { token: stored } : null;
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const login = useCallback(async (emailOrUsername, password) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.auth.login({ emailOrUsername, password });
            const token = response.token;
            localStorage.setItem('sp_token', token);
            setUser({ token });
            return response;
        } catch (err) {
            const errorMsg = err?.response?.data?.message || err?.message || 'Login failed';
            setError(errorMsg);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const register = useCallback(async (payload) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.auth.register(payload);
            const token = response.token;
            localStorage.setItem('sp_token', token);
            setUser({ token });
            return response;
        } catch (err) {
            const errorMsg = err?.response?.data?.message || err?.message || 'Registration failed';
            setError(errorMsg);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const logout = useCallback(async () => {
        setLoading(true);
        try {
            if (user?.token) {
                await api.auth.logout();
            }
            localStorage.removeItem('sp_token');
            setUser(null);
        } catch (err) {
            console.error('Logout error:', err);
            localStorage.removeItem('sp_token');
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, [user]);

    const resetPassword = useCallback(async (oldPassword, newPassword) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.auth.resetPassword({ oldPassword, newPassword });
            return response;
        } catch (err) {
            const errorMsg = err?.response?.data?.message || err?.message || 'Password reset failed';
            setError(errorMsg);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, error, login, logout, register, resetPassword }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = React.useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}
