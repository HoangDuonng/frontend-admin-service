"use client";

import React, { useEffect, useState } from "react";
import Icon from "../icon";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

interface NavItem {
  href?: string;
  label: string;
  icon: React.ReactNode;
  children?: NavItem[];
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [apiNavigation, setApiNavigation] = useState<{ title: string; href: string }[]>([]);

  useEffect(() => {
    setMounted(true);
  }, [theme]);

  useEffect(() => {
    fetch('/api/header?language=vi')
      .then(res => res.json())
      .then(data => {
        if (data && data.data && Array.isArray(data.data.navigation)) {
          setApiNavigation(data.data.navigation);
        }
      });
  }, []);

  const cmsChildren: NavItem[] = [
    {
      href: '/cms/header',
      label: 'Header',
      icon: <Icon category="interface" name="document" className="w-4 h-4" />,
    },
    {
      href: '/cms/footer',
      label: 'Footer',
      icon: <Icon category="interface" name="document-text" className="w-4 h-4" />,
      },
      {
        href: '/cms/homepage',
        label: 'Homepage',
        icon: <Icon category="interface" name="image" className="w-4 h-4" />,
      },
      {
        href: '/cms/tour',
        label: 'Tour',
        icon: <Icon category="interface" name="image" className="w-4 h-4" />,
      },
    ...apiNavigation.map(item => ({
      href: `/cms${item.href.startsWith('/') ? item.href : '/' + item.href}`,
      label: item.title,
      icon: <Icon category="interface" name="document" className="w-4 h-4" />,
    })),
  ];

  const navItems: NavItem[] = [
    {
      href: '/',
      label: 'Home',
      icon: <Icon category="interface" name="home 04" className="w-5 h-5" />,
    },
    {
      label: 'CMS',
      icon: <Icon category="interface" name="edit-rectangle" className="w-5 h-5" />,
      children: cmsChildren,
    },
    {
      label: 'Products',
      icon: <Icon category="finance_and_payment" name="cube" className="w-5 h-5" />,
      children: [
        {
          href: '/product/list',
          label: 'Product List',
          icon: <Icon category="interface" name="list" className="w-4 h-4" />,
        },
        {
          href: '/product/categories',
          label: 'Categories',
          icon: <Icon category="interface" name="folder" className="w-4 h-4" />,
        },
        {
          href: '/product/inventory',
          label: 'Inventory',
          icon: <Icon category="interface" name="box" className="w-4 h-4" />,
        },
      ],
    },
    {
      label: 'User',
      icon: <Icon category="user" name="user" className="w-5 h-5" />,
      children: [
        {
          href: '/user/list',
          label: 'User List',
          icon: <Icon category="user" name="user" className="w-4 h-4" />,
        },
        {
          href: '/user/roles',
          label: 'Roles & Permissions',
          icon: <Icon category="interface" name="shield" className="w-4 h-4" />,
        },
        {
          href: '/user/activity',
          label: 'User Activity',
          icon: <Icon category="interface" name="activity" className="w-4 h-4" />,
        },
      ],
    },
    {
      href: '/customer',
      label: 'Customers',
      icon: <Icon category="user" name="user-circle" className="w-5 h-5" />,
    },
    {
      label: 'Shop',
      icon: <Icon category="ecommerce" name="cart" className="w-5 h-5" />,
      children: [
        {
          href: '/shop/orders',
          label: 'Orders',
          icon: <Icon category="ecommerce" name="shopping-bag" className="w-4 h-4" />,
        },
        {
          href: '/shop/transactions',
          label: 'Transactions',
          icon: <Icon category="finance_and_payment" name="money" className="w-4 h-4" />,
        },
        {
          href: '/shop/analytics',
          label: 'Analytics',
          icon: <Icon category="finance_and_payment" name="bar-chart" className="w-4 h-4" />,
        },
      ],
    },
  ];

  const handleDropdownToggle = (label: string) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };

  const isActive = (item: NavItem): boolean => {
    if (item.href && pathname === item.href) return true;
    if (item.children) {
      return item.children.some(child => child.href && pathname === child.href);
    }
    return false;
  };

  const renderNavItem = (item: NavItem, isSubItem = false) => {
    const hasChildren = item.children && item.children.length > 0;
    const isDropdownOpen = openDropdown === item.label;
    const active = isActive(item);

    if (hasChildren) {
      return (
        <div key={item.label} className="mx-5">
          <button
            onClick={() => handleDropdownToggle(item.label)}
            className={`flex items-center justify-between w-full py-2 rounded-xl transition
              ${active
                ? 'bg-gray-100 dark:bg-gray-700 font-semibold text-gray-900 dark:text-gray-100 pl-6'
                : 'text-gray-500 dark:text-gray-300 pl-6 hover:bg-gray-100 hover:dark:bg-gray-700'
              }`}
          >
            <div className="flex items-center gap-3">
              {item.icon}
              {item.label}
            </div>
            <Icon
              category="arrows"
              name="arrow-down"
              className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
            />
          </button>
          {isDropdownOpen && (
            <div className="ml-6 mt-1 space-y-1">
              {item.children!.map((child) => renderNavItem(child, true))}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        key={item.href}
        href={item.href!}
        className={`flex items-center gap-3 py-2 rounded-xl transition mx-5
          ${isSubItem ? 'ml-4' : ''}
          ${pathname === item.href
            ? 'bg-gray-100 dark:bg-gray-700 font-semibold text-gray-900 dark:text-gray-100 pl-6'
            : 'text-gray-700 dark:text-gray-300 pl-6 hover:bg-gray-100 hover:dark:bg-gray-700'
          }`}
        onClick={() => {
          if (sidebarOpen) setSidebarOpen(false);
        }}
      >
        {item.icon}
        {item.label}
      </Link>
    );
  };

  return (
    <>
      <aside className="hidden md:flex fixed top-0 left-0 h-screen w-64 z-50 bg-white dark:bg-gray-800 dark:border-gray-700 border-r flex-col justify-between overflow-x-hidden">
        <div>
          <div className="flex items-center justify-between h-20 font-bold text-xl tracking-tight px-4 ">
            <img src="/images/logo.svg" alt="Logo" className="h-16 w-auto mx-auto" onClick={() => router.push('/')} style={{ cursor: 'pointer' }} />
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden p-2 text-gray-700 dark:text-gray-300"
              aria-label="Đóng sidebar"
            >
              <Icon category="interface" name="remove" className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex flex-col gap-2 overflow-y-auto overflow-x-hidden">
            {navItems.map((item) => renderNavItem(item))}
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
          <aside className="w-72 bg-white dark:bg-gray-800 h-full p-4 text-right flex flex-col">
            <div className="flex items-center justify-between h-16 font-bold text-xl tracking-tight mb-4 px-2">
              <img src="/images/logo.svg" alt="Logo" className="h-10 w-auto mx-auto" />
              <button onClick={() => setSidebarOpen(false)} className="p-2 text-gray-700 dark:text-gray-300" aria-label="Đóng sidebar">
                <Icon category="interface" name="remove" className="w-6 h-6" />
              </button>
            </div>
            <nav className="flex flex-col gap-2 mt-2 overflow-y-auto">
              {navItems.map((item) => renderNavItem(item))}
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
