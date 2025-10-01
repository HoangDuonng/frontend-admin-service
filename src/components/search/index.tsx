"use client";

import React, { useState } from "react";
import Icon from "@/components/icon";

interface SearchProps {
    className?: string;
    placeholder?: string;
}

const Search = ({ className = "", placeholder = "Search or type a command" }: SearchProps) => {
    const [showSearch, setShowSearch] = useState(false);

    return (
        <>
            <div className="relative">
                <input
                    className={`w-32 sm:w-48 md:w-80 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 focus:outline-none hidden md:block ${className}`}
                    placeholder={placeholder}
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hidden md:block">
                    <Icon name="search 02" category="interface" className="w-5 h-5 text-gray-400" />
                </span>
            </div>
            <button
                className="block md:hidden p-2"
                onClick={() => setShowSearch((v) => !v)}
            >
                <Icon name="search 02" category="interface" className="w-6 h-6" />
            </button>
            {showSearch && (
                <input
                    autoFocus
                    className="absolute left-0 right-0 top-16 mx-4 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 focus:outline-none z-50 block md:hidden"
                    placeholder={placeholder}
                    onBlur={() => setShowSearch(false)}
                />
            )}
        </>
    );
};

export default Search; 