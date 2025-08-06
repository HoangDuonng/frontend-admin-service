'use client';

import { useState, useEffect } from 'react';
import { login as loginService } from '@/services/userService';
import { LoginRequest, LoginResponse, AuthUser } from '@/types/auth';

const ADMIN_SESSION_TIMEOUT = 30 * 60 * 1000;

export const useAuth = () => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [isClient, setIsClient] = useState(false);

    const checkSessionValidity = (loginTime: number): boolean => {
        const now = Date.now();
        const sessionAge = now - loginTime;
        return sessionAge < ADMIN_SESSION_TIMEOUT;
    };

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (!isClient) return;

        const logoutFlag = sessionStorage.getItem('isLoggingOut');
        if (logoutFlag === 'true') {
            console.log('Found logout flag, setting isLoggingOut to true');
            setIsLoggingOut(true);
            sessionStorage.removeItem('isLoggingOut'); 

            setTimeout(() => {
                console.log('Resetting logout state');
                setIsLoggingOut(false);
            }, 1000);
        }

        const getCookie = (name: string) => {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop()?.split(';').shift();
            return null;
        };

        const accessToken = getCookie('accessToken');
        const userCookie = getCookie('user');
        const loginTime = localStorage.getItem('loginTime');

        if (accessToken && userCookie) {
            try {
                const userData = JSON.parse(decodeURIComponent(userCookie));
                const loginTimestamp = loginTime ? parseInt(loginTime) : Date.now();

                if (checkSessionValidity(loginTimestamp)) {
                    setToken(accessToken);
                    setUser(userData);
                } else {
                    clearAuthData();
                }
            } catch (error) {
                console.error('Error parsing user data from cookie:', error);
                clearAuthData();
            }
        }
        setLoading(false);
    }, [isClient]);

    const clearAuthData = () => {
        document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie = 'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie = 'user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

        localStorage.removeItem('loginTime');

        setToken(null);
        setUser(null);
    };

    const login = async (loginData: LoginRequest): Promise<LoginResponse> => {
        try {
            setLoading(true);
            const response = await loginService(loginData);

            // Store login time in localStorage
            localStorage.setItem('loginTime', Date.now().toString());

            // Update state immediately from response
            setToken(response.token);
            setUser(response.user);

            return response;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        console.log('Logout called, setting isLoggingOut to true');
        setIsLoggingOut(true);

        // Set logout flag in sessionStorage
        if (typeof window !== 'undefined') {
            sessionStorage.setItem('isLoggingOut', 'true');
        }

        // Clear cookies
        document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie = 'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie = 'user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

        // Clear localStorage
        localStorage.removeItem('loginTime');

        // Clear state immediately
        setToken(null);
        setUser(null);

        // Force redirect to login page
        if (typeof window !== 'undefined') {
            console.log('Redirecting to login page immediately');
            window.location.href = '/login';
        }
    };

    const isAuthenticated = !!token && !!user;

    const isSessionExpiringSoon = (): boolean => {
        const loginTime = localStorage.getItem('loginTime');
        if (!loginTime) return false;

        const now = Date.now();
        const loginTimestamp = parseInt(loginTime);
        const sessionAge = now - loginTimestamp;
        const warningThreshold = ADMIN_SESSION_TIMEOUT - (5 * 60 * 1000); // 5 minutes before expiry

        return sessionAge > warningThreshold;
    };

    return {
        user,
        token,
        loading,
        isLoggingOut,
        login,
        logout,
        isAuthenticated,
        isSessionExpiringSoon,
    };
}; 
