"use client";

import React from "react";
import Icon from "@/components/icon";
import Search from "@/components/search";
import UserDropdown from "./UserDropdown";
import { AuthUser } from "@/types/auth";

interface HeaderProps {
  setSidebarOpen: (open: boolean) => void;
  user?: AuthUser;
  onLogout?: () => void;
}

const Header = ({ setSidebarOpen, user, onLogout }: HeaderProps) => {
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
        {user ? (
          <UserDropdown user={user} onLogout={onLogout || (() => { })} />
        ) : null}
      </div>
    </header>
  );
};

export default Header;
