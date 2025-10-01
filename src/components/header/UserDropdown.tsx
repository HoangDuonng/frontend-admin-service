"use client";

import React, { useState, useRef, useEffect } from "react";
import Icon from "@/components/icon";
import { FiLogOut, FiUser, FiSettings } from "react-icons/fi";
// import { AuthUser } from "@/types/auth";

interface UserDropdownProps {
    user: any; // Temporarily use any instead of AuthUser
    onLogout: () => void;
}

const UserDropdown = ({ user, onLogout }: UserDropdownProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Debug: log user data to see what fields are available
    console.log('User data:', user);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    // Get role from user data - check multiple possible fields
    const getUserRole = () => {
        // Temporarily return a default role for development
        return user?.role || user?.roles?.[0] || user?.userRole || user?.roleName || user?.authorities?.[0] || 'Admin';
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium">
                    {user.avatar ? (
                        <img
                            src={user.avatar}
                            alt={user.fullName}
                            className="w-8 h-8 rounded-full object-cover"
                        />
                    ) : (
                        getInitials(user.fullName)
                    )}
                </div>
                <div className="flex flex-col items-start">
                    <span className="text-sm font-medium">{user.fullName}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">[{getUserRole()}]</span>
                </div>
                <Icon
                    name={isOpen ? "arrow-up" : "arrow-down"}
                    category="arrows"
                    className="w-4 h-4"
                />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {user.fullName}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                            <span>{user.email}</span>
                            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs font-medium">
                                {getUserRole()}
                            </span>
                        </div>
                    </div>

                    <div className="py-1">
                        <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                            <FiUser className="w-4 h-4" />
                            Hồ sơ
                        </button>

                        <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                            <FiSettings className="w-4 h-4" />
                            Cài đặt
                        </button>

                        <button
                            onClick={() => {
                                onLogout();
                                setIsOpen(false);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                            <FiLogOut className="w-4 h-4" />
                            Đăng xuất
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserDropdown; 
