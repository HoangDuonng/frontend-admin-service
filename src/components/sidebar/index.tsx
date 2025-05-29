"use client";

import React, { useEffect } from "react";
import Icon from "../icon";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  useEffect(() => {
    setMounted(true);
  }, [theme]);

  const navItems = [
    {
      href: '/',
      label: 'Home',
      icon: <Icon category="interface" name="home 04" className="w-5 h-5" />,
    },
    {
      href: '/product',
      label: 'Products',
      icon: <Icon category="finance_and_payment" name="cube" className="w-5 h-5" />,
    },
    {
      href: '/user',
      label: 'User',
      icon: <Icon category="user" name="user" className="w-5 h-5" />,
    },
    {
      href: '/customer',
      label: 'Customers',
      icon: <Icon category="user" name="user-circle" className="w-5 h-5" />,
    },
    {
      href: '/shop',
      label: 'Shop',
      icon: <Icon category="ecommerce" name="cart" className="w-5 h-5" />,
    },
  ];

  return (
    <>
      <aside className="hidden md:flex fixed top-0 left-0 h-screen w-52 z-50 bg-white dark:bg-gray-800 dark:border-gray-700 border-r flex-col justify-between">
        <div>
          <div className="flex items-center justify-between h-16 font-bold text-xl tracking-tight px-4">
            <span>Dashboard</span>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden p-2 text-gray-700 dark:text-gray-300"
              aria-label="Đóng sidebar"
            >
              <Icon category="interface" name="remove" className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex flex-col gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 py-2 rounded-xl transition mx-5
                  ${pathname === item.href
                    ? 'bg-gray-100 dark:bg-gray-700 font-semibold text-gray-900 dark:text-gray-100 pl-6'
                    : 'text-gray-700 dark:text-gray-300 pl-6 hover:bg-gray-100 hover:dark:bg-gray-700'
                  }`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="px-4 pb-6">
          <div className="flex items-center justify-center">
            <div className="flex bg-gray-100 rounded-full p-0.5 px-1 w-full max-w-[200px] gap-x-2 justify-between dark:bg-gray-700">
              <button
                className={`flex-1 flex items-center gap-1 px-2 py-0.5 rounded-full transition ${mounted && theme === 'light'
                  ? 'bg-white dark:bg-gray-700 shadow text-gray-900 dark:text-gray-100 font-semibold'
                  : 'text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                onClick={() => setTheme('light')}
                disabled={!mounted}
              >
                <span className="text-lg"><Icon name="light mode" category="device" className="w-5 h-5" /></span> Light
              </button>
              <button
                className={`flex-1 flex items-center gap-1 px-2 py-0.5 rounded-full transition ${mounted && theme === 'dark'
                  ? 'bg-white dark:bg-gray-600 shadow text-gray-900 dark:text-gray-100 font-semibold'
                  : 'text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                onClick={() => setTheme('dark')}
                disabled={!mounted}
              >
                <span className="text-lg"><Icon name="night mode" category="device" className="w-5 h-5" /></span> Dark
              </button>
            </div>
          </div>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex md:hidden">
          <aside className="w-64 bg-white dark:bg-gray-800 h-full p-4 text-right flex flex-col">
            <div className="flex items-center justify-between h-16 font-bold text-xl tracking-tight mb-4 px-2">
              <span>Dashboard</span>
              <button onClick={() => setSidebarOpen(false)} className="p-2 text-gray-700 dark:text-gray-300" aria-label="Đóng sidebar">
                <Icon category="interface" name="remove" className="w-6 h-6" />
              </button>
            </div>
            <nav className="flex flex-col gap-2 mt-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 py-2 rounded-xl transition mx-5
                    ${pathname === item.href
                      ? 'bg-gray-100 dark:bg-gray-700 font-semibold text-gray-900 dark:text-gray-100 pl-6'
                      : 'text-gray-700 dark:text-gray-300 pl-6 hover:bg-gray-100 hover:dark:bg-gray-700'
                    }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="flex items-center justify-center mt-auto">
              <div className="flex bg-gray-100 rounded-full p-0.5 px-1 w-full max-w-[200px] gap-x-2 justify-between dark:bg-gray-700">
                <button
                  className={`flex-1 flex items-center gap-1 px-2 py-0.5 rounded-full transition ${mounted && theme === 'light'
                    ? 'bg-white dark:bg-gray-700 shadow text-gray-900 dark:text-gray-100 font-semibold'
                    : 'text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  onClick={() => setTheme('light')}
                  disabled={!mounted}
                >
                  <span className="text-lg"><Icon name="light mode" category="device" className="w-5 h-5" /></span> Light
                </button>
                <button
                  className={`flex-1 flex items-center gap-1 px-2 py-0.5 rounded-full transition ${mounted && theme === 'dark'
                    ? 'bg-white dark:bg-gray-600 shadow text-gray-900 dark:text-gray-100 font-semibold'
                    : 'text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  onClick={() => setTheme('dark')}
                  disabled={!mounted}
                >
                  <span className="text-lg"><Icon name="night mode" category="device" className="w-5 h-5" /></span> Dark
                </button>
              </div>
            </div>
          </aside>
          <div className="flex-1" onClick={() => setSidebarOpen(false)} />
        </div>
      )}
    </>
  );
};

export default Sidebar;
