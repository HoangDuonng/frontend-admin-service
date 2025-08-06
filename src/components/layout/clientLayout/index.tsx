"use client";

import React, { useState } from "react";
import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import Footer from "@/components/footer";
import BackToTop from "@/components/layout/backToTop";
import { useAuth } from "@/hooks/useAuth";
import AuthGuard from "@/components/auth/AuthGuard";

const ClientLayout = ({ children }: { children: React.ReactNode }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { user, logout } = useAuth();

    return (
        // <AuthGuard>
            <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
                <Header
                    setSidebarOpen={setSidebarOpen}
                    user={user || undefined}
                    onLogout={logout}
                />
                <div className="flex flex-1">
                    <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                    <main className="pt-16 p-4 md:p-8 flex-1 flex flex-col bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 md:ml-64 transition-all duration-300">
                        {children}
                    </main>
                </div>
                <Footer />
                <BackToTop />
            </div>
        // </AuthGuard>
    );
};

export default ClientLayout;
