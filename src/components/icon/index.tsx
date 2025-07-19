'use client';

import React from 'react';

import CubeIcon from '@/icons/finance_and_payment/outline/cube.svg';
import AtmIcon from '@/icons/finance_and_payment/outline/atm.svg';

import AddCircleIcon from '@/icons/interface/outline/add-circle.svg';
import Home04Icon from '@/icons/interface/outline/home 04.svg';
import Search02Icon from '@/icons/interface/outline/search 02.svg';
import RemoveIcon from '@/icons/interface/outline/remove.svg';
import EditRectangleIcon from '@/icons/interface/outline/edit-rectangle.svg';
import AddRectangleIcon from '@/icons/interface/outline/add-rectangle.svg';
import ClearRectangleIcon from '@/icons/interface/outline/clear-rectangle.svg';
import GlobeIcon from '@/icons/interface/outline/globe.svg';
import CompassIcon from '@/icons/interface/outline/compass.svg';
import LocationIcon from '@/icons/interface/outline/location 01.svg';
import CalendarIcon from '@/icons/interface/outline/calendar.svg';
import InteractiveIcon from '@/icons/interface/outline/interactive.svg';
import NotificationRingingIcon from '@/icons/interface/outline/notification-ringing.svg';

import UserCustomerIcon from '@/icons/user/outline/user-circle.svg';
import UserIcon from '@/icons/user/outline/user.svg';

import ShopIcon from '@/icons/ecommerce/outline/cart.svg';

import LightIcon from '@/icons/device/outline/light mode.svg';
import DarkIcon from '@/icons/device/outline/night mode.svg';

import UpArrowIcon from '@/icons/arrows/solid/up-arrow 01.svg';

import MenuLineIcon from '@/icons/menu/outline/menu-line-horizontal.svg';

import AlignJustifyIcon from '@/icons/editor/outline/align-justify.svg';

const icons = {
    finance_and_payment: {
        cube: CubeIcon,
        atm: AtmIcon,
        // Thêm icon khác ở đây
    },
    user: {
        'user-circle': UserCustomerIcon,
        'user': UserIcon,
        // Thêm icon khác ở đây
    },
    interface: {
        'home 04': Home04Icon,
        'add-circle': AddCircleIcon,
        'search 02': Search02Icon,
        'remove': RemoveIcon,
        'edit-rectangle': EditRectangleIcon,
        'add-rectangle': AddRectangleIcon,
        'clear-rectangle': ClearRectangleIcon,
        'globe': GlobeIcon,
        'compass': CompassIcon,
        'location 01': LocationIcon,
        'calendar': CalendarIcon,
        'interactive': InteractiveIcon,
        'notification-ringing': NotificationRingingIcon,
        // Thêm icon khác ở đây
    },
    ecommerce: {
        'cart': ShopIcon,
        // Thêm icon khác ở đây
    },
    device: {
        'light mode': LightIcon,
        'night mode': DarkIcon,
        // Thêm icon khác ở đây
    },
    arrows: {
        'up-arrow 01': UpArrowIcon,
        // Thêm icon khác ở đây
    },
    // Thêm category khác nếu cần
    menu: {
        'menu-line': MenuLineIcon,
    },
    editor: {
        'align-justify': AlignJustifyIcon,
    },
};

type Category = keyof typeof icons;

type IconProps = {
    category: Category;
    name: string;
    className?: string;
    [key: string]: any;
};

const Icon: React.FC<IconProps> = ({ category, name, className, ...rest }) => {
    const CategoryIcons = icons[category];
    if (!CategoryIcons) return null;
    const SvgIcon = CategoryIcons[name as keyof typeof CategoryIcons] as React.FC<any>;
    if (!SvgIcon) return null;
    return <SvgIcon className={className} {...rest} />;
};

export default Icon; 
