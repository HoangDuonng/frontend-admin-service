"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

interface AuthGuardProps {
    children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
    const { isAuthenticated, loading, isLoggingOut, isSessionExpiringSoon } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [showExpiryWarning, setShowExpiryWarning] = useState(false);
    const [isClient, setIsClient] = useState(false);

    const isLoginPage = pathname === '/login';

    useEffect(() => {
        setIsClient(true);
    }, []);



    useEffect(() => {
        if (loading) return;

        if (isLoginPage && isAuthenticated) {
            router.replace('/');
            return;
        }

        if (!isLoginPage && !isAuthenticated) {
            router.replace('/login');
            return;
        }
    }, [isAuthenticated, loading, isLoginPage, router]);

    useEffect(() => {
        if (!loading && !isAuthenticated && !isLoginPage) {
            router.push('/login');
        }
    }, [isAuthenticated, loading, isLoginPage, router]);

    useEffect(() => {
        if (isAuthenticated && isSessionExpiringSoon()) {
            setShowExpiryWarning(true);
        }
    }, [isAuthenticated, isSessionExpiringSoon]);

    if (!isClient || loading || isLoggingOut) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                    <div className="loader mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">
                        {isLoggingOut ? 'Đang đăng xuất...' : 'Đang kiểm tra phiên đăng nhập...'}
                    </p>
                </div>
            </div>
        );
    }

    if (isLoggingOut) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                    <div className="loader mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Đang đăng xuất...</p>
                </div>
            </div>
        );
    }

    if (showExpiryWarning) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md mx-4">
                    <div className="text-center">
                        <div className="text-yellow-500 text-4xl mb-4">⚠️</div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                            Phiên đăng nhập sắp hết hạn
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            Phiên đăng nhập của bạn sẽ hết hạn trong ít phút nữa. Vui lòng đăng nhập lại để tiếp tục.
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowExpiryWarning(false)}
                                className="flex-1 px-4 py-2 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                            >
                                Tiếp tục
                            </button>
                            <button
                                onClick={() => {
                                    setShowExpiryWarning(false);
                                    router.push('/login');
                                }}
                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Đăng nhập lại
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!isLoginPage && !isAuthenticated) {
        return null;
    }

    return <>{children}</>;
} 
