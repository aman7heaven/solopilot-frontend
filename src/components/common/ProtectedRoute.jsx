import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ children }) {
    const { user } = useAuth();
    const [isChecked, setIsChecked] = useState(false);
    const [hasToken, setHasToken] = useState(false);

    useEffect(() => {
        // Check if token exists in localStorage
        try {
            const token = localStorage.getItem('sp_token');
            setHasToken(!!token && !!user?.token);
        } catch (e) {
            console.error('Token check error:', e);
        }
        setIsChecked(true);
    }, [user]);

    if (!isChecked) {
        return null; // Loading state while checking token
    }

    if (!hasToken && !user?.token) {
        return <Navigate to="/login" replace />;
    }

    return children;
}
