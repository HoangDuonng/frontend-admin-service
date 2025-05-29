"use client";

import React, { useState } from "react";
import Icon from "@/components/icon";

interface HeaderProps {
  setSidebarOpen: (open: boolean) => void;
}

const Header = ({ setSidebarOpen }: HeaderProps) => {
  const [showSearch, setShowSearch] = useState(false);

  return (
    <header className="flex items-center justify-between px-8 py-4 bg-white dark:bg-gray-800 border-b border-gray-200 fixed top-0 left-0 right-0 z-40 h-16 text-gray-900 dark:text-gray-100 dark:border-gray-700">
      <div className="flex items-center gap-2">
        <button
          className="block md:hidden p-2 mr-2 text-gray-700 dark:text-gray-300"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open sidebar"
        >
          <Icon name="menu-line" category="menu" className="w-6 h-6 text-gray-700 dark:text-gray-300" />
        </button>
      </div>
      <div className="flex items-center gap-2 md:gap-4">
        <div className="relative">
          <input
            className="w-32 sm:w-48 md:w-80 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 focus:outline-none hidden md:block"
            placeholder="Search or type a command"
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
            placeholder="Search or type a command"
            onBlur={() => setShowSearch(false)}
          />
        )}
        <button className="h-10 px-4 text-gray-700 dark:text-gray-300 font-medium hover:text-blue-500 rounded-lg whitespace-nowrap">Sign in</button>
        <button className="h-10 px-4 bg-blue-400 text-white rounded-lg font-semibold dark:bg-gray-700 hover:bg-blue-500 whitespace-nowrap">Sign up</button>
      </div>
    </header>
  );
};

export default Header;
