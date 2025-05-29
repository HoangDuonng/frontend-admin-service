import React from "react";
import Link from "next/link";
import { customers } from '@/mocks/customers';
import { posts } from '@/mocks/posts';

import UserTable from '@/components/user/user-table';
import PostTable from '@/components/post/post-table';

const stats = [
    { label: "Khách hàng", value: customers.length },
    { label: "Bài viết", value: posts.length },
    { label: "Đơn hàng", value: 87 },
    { label: "Bình luận", value: 210 },
];

const recentCustomers = customers.slice(0, 3).map(c => ({
    name: c.user || c.login || 'Chưa rõ',
    email: c.email || 'N/A',
    joined: 'N/A',
}));

const recentBlogs = posts.slice(0, 3).map(p => ({
    title: p.title || 'Không tiêu đề',
    date: 'N/A',
}));

const UserPage = () => {
    return (
        <div className="p-4 md:p-6 mt-5">
            <h1 className="text-2xl font-bold mb-6">Quản lý User</h1>
            {/* Tổng quan */}
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8 min-w-0 justify-items-center">
                {stats.map((stat, idx) => (
                    <div
                        key={idx}
                        className="bg-white dark:bg-gray-700 rounded-xl shadow p-5 flex flex-col items-center gap-2 w-full max-w-xs"
                    >
                        <div className="text-2xl font-bold">{stat.value}</div>
                        <div className="text-gray-900 dark:text-gray-300 font-medium">{stat.label}</div>
                    </div>
                ))}
            </div>
            {/* Shortcut quản lý */}
            <div className="flex flex-wrap gap-4 mb-8 justify-center md:justify-start">
                <Link href="/user/customers" className="button-stroke px-6 py-3 rounded-xl font-semibold dark:bg-gray-700 whitespace-nowrap">Quản lý khách hàng</Link>
                <Link href="/user/blogs" className="button-stroke px-6 py-3 rounded-xl font-semibold dark:bg-gray-700 whitespace-nowrap">Quản lý blog</Link>
                <Link href="/user/orders" className="button-stroke px-6 py-3 rounded-xl font-semibold dark:bg-gray-700 whitespace-nowrap">Quản lý đơn hàng</Link>
                <Link href="/user/comments" className="button-stroke px-6 py-3 rounded-xl font-semibold dark:bg-gray-700 whitespace-nowrap">Quản lý bình luận</Link>
            </div>
            {/* Bảng khách hàng gần đây */}
            <div className="bg-white dark:bg-gray-700 rounded-xl shadow p-3 sm:p-5 mb-8 overflow-x-auto">
                <div className="font-bold mb-4">Khách hàng gần đây</div>
                <UserTable />
            </div>
            {/* Bảng bài viết gần đây */}
            <div className="bg-white dark:bg-gray-700 rounded-xl shadow p-3 sm:p-5 overflow-x-auto">
                <div className="font-bold mb-4">Bài viết gần đây</div>
                <PostTable />
            </div>
        </div>
    );
};

export default UserPage; 
