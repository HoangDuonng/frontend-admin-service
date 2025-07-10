"use client";

import React from "react";
import Icon from "@/components/icon";
import Search from "@/components/search";

interface HeaderProps {
  setSidebarOpen: (open: boolean) => void;
}

const Header = ({ setSidebarOpen }: HeaderProps) => {
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
        <Search />
        <button className="h-10 px-4 text-gray-700 dark:text-gray-300 font-medium hover:text-blue-500 rounded-lg whitespace-nowrap">Sign in</button>
        <button className="h-10 px-4 bg-blue-400 text-white rounded-lg font-semibold dark:bg-gray-700 hover:bg-blue-500 whitespace-nowrap">Sign up</button>
      </div>
    </header>
  );
};

export default Header;
