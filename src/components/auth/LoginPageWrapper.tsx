"use client";

import { useEffect } from 'react';
import SignInClientWrapper from './SignInClientWrapper';

export default function LoginPageWrapper() {
    useEffect(() => {
        // Add CSS class to body to hide layout elements
        document.body.classList.add('login-page');

        // Cleanup function to remove class when component unmounts
        return () => {
            document.body.classList.remove('login-page');
        };
    }, []);

    return <SignInClientWrapper />;
} 
