'use client';

import React from 'react';

import CubeIcon from '@/icons/finance_and_payment/outline/cube.svg';
import AtmIcon from '@/icons/finance_and_payment/outline/atm.svg';

import AddCircleIcon from '@/icons/interface/outline/add-circle.svg';
import Home04Icon from '@/icons/interface/outline/home 04.svg';
import Search02Icon from '@/icons/interface/outline/search 02.svg';
import RemoveIcon from '@/icons/interface/outline/remove.svg';

import UserCustomerIcon from '@/icons/user/outline/user-circle.svg';

import ShopIcon from '@/icons/ecommerce/outline/cart.svg';

import UserIcon from '@/icons/user/outline/user.svg';

import LightIcon from '@/icons/device/outline/light mode.svg';
import DarkIcon from '@/icons/device/outline/night mode.svg';

import UpArrowIcon from '@/icons/arrows/solid/up-arrow 01.svg';

import MenuLineIcon from '@/icons/menu/outline/menu-line-horizontal.svg';

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
