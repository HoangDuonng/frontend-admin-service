"use client";

import React, { useEffect, useState } from "react";
import Icon from "../icon";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import Image from 'next/image';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

interface NavItem {
  href?: string;
  label: string;
  icon?: React.ReactNode;
  children?: NavItem[];
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [apiNavigation, setApiNavigation] = useState<{ title: string; href: string }[]>([]);
  const isClickingRef = React.useRef(false);

  // Mapping từ href/title sang icon
  const getIconForNavigation = (href: string, title: string): string => {
    const iconMapping: { [key: string]: string } = {
      '/kham-pha': 'compass',
      '/le-hoi-va-su-kien': 'calendar',
      '/tin-tuc': 'notification-ringing',
      '/cam-nang-du-lich': 'interactive',
      '/khach-san': 'location 01',
      '/tour': 'globe',
    };

    if (iconMapping[href]) {
      return iconMapping[href];
    }

    const titleMapping: { [key: string]: string } = {
      'Khám phá': 'compass',
      'Lễ hội & Sự kiện': 'calendar',
      'Tin tức': 'notification-ringing',
      'Cẩm nang du lịch': 'interactive',
      'Khách sạn': 'location 01',
      'Tour': 'globe',
    };

    return titleMapping[title] || 'document';
  };

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
      href: '/cms/banner',
      label: 'Banner',
      icon: <Icon category="interface" name="image" className="w-4 h-4" />,
    },
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
      href: '/tour',
      label: 'Tour',
      icon: <Icon category="interface" name="globe" className="w-5 h-5" />,
    },
    ...apiNavigation.map(item => ({
      href: `${item.href.startsWith('/') ? item.href : '/' + item.href}`,
      label: item.title,
      icon: <Icon category="interface" name={getIconForNavigation(item.href, item.title)} className="w-5 h-5" />,
    })),
    {
      label: 'User',
      icon: <Icon category="user" name="user" className="w-5 h-5" />,
      children: [
        {
          href: '/user/list',
          label: 'User List',
        },
        {
          href: '/role-permission/list',
          label: 'Roles & Permissions',
        },
      ],
    },
  ];

  useEffect(() => {
    // Chỉ tự động mở dropdown khi navigate đến item con, không can thiệp khi user click
    if (!isClickingRef.current) {
      const activeDropdown = navItems.find(item =>
        item.children && item.children.some(child => child.href && pathname === child.href)
      );

      if (activeDropdown && openDropdown !== activeDropdown.label) {
        setOpenDropdown(activeDropdown.label);
      }
    }
  }, [pathname, navItems]);

  const handleDropdownToggle = (label: string) => {
    // Đánh dấu đang trong quá trình click
    isClickingRef.current = true;

    // Nếu đang mở dropdown này thì đóng lại, nếu không thì mở
    if (openDropdown === label) {
      setOpenDropdown(null);
    } else {
      setOpenDropdown(label);
    }

    // Reset sau một khoảng thời gian ngắn
    setTimeout(() => {
      isClickingRef.current = false;
    }, 100);
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
            className={`flex items-center justify-between w-full py-3 rounded-xl transition-all duration-200
              ${active
                ? 'bg-blue-50 dark:bg-blue-900/20 font-semibold text-blue-700 dark:text-blue-300 pl-6 border-l-4 border-blue-500'
                : 'text-gray-600 dark:text-gray-300 pl-6 hover:bg-blue-50 hover:dark:bg-blue-900/10 hover:text-blue-600 hover:dark:text-blue-300'
              }`}
          >
            <div className="flex items-center gap-3">
              {item.icon}
              {item.label}
            </div>
            <Icon
              category="arrows"
              name="arrow-down"
              className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
            />
          </button>
          {isDropdownOpen && (
            <div className="ml-6 mt-2 space-y-1 border-l-2 border-blue-200 dark:border-blue-600 pl-4 relative">
              {/* Dấu chấm tròn cho item active */}
              {item.children!.map((child, index) => {
                const isChildActive = child.href && pathname === child.href;
                return (
                  <div key={child.href} className="relative">
                    {isChildActive && (
                      <div className="absolute -left-6 top-1/2 transform -translate-y-1/2 w-4 h-0.5 bg-blue-500 border border-blue-500 z-10"></div>
                    )}
                    {renderNavItem(child, true)}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        key={item.href}
        href={item.href!}
        className={`flex items-center gap-3 py-2.5 rounded-lg transition-all duration-200 mx-5
          ${isSubItem ? 'ml-0' : ''}
          ${pathname === item.href
            ? 'bg-blue-50 dark:bg-blue-900/20 font-semibold text-blue-700 dark:text-blue-300 pl-6 border-l-2 border-blue-500'
            : 'text-gray-600 dark:text-gray-300 pl-6 hover:bg-blue-50 hover:dark:bg-blue-900/10 hover:text-blue-600 hover:dark:text-blue-300'
          }`}
        onClick={() => {
          if (sidebarOpen) setSidebarOpen(false);
        }}
      >
        {item.icon && item.icon}
        {item.label}
      </Link>
    );
  };

  return (
    <>
      <aside className="hidden md:flex fixed top-0 left-0 h-screen w-64 z-50 bg-white dark:bg-gray-800 dark:border-gray-700 border-r flex-col justify-between overflow-x-hidden">
        <div>
          <div className="flex items-center justify-between h-20 font-bold text-xl tracking-tight px-4 ">
            <Image
              src="/images/logo.svg"
              alt="Logo"
              width={100}
              height={100}
              className="h-16 w-auto mx-auto cursor-pointer"
              onClick={() => router.push('/')}
              priority
            />
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
              <Image
                src="/images/logo.svg"
                alt="Logo"
                width={40}
                height={40}
                className="h-10 w-auto mx-auto"
                priority
              />
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
