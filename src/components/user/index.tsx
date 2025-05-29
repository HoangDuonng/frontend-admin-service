"use client";

import React from "react";
import Link from "next/link";
import Icon from "../icon";

interface User {
    title: string;
    avatar: string;
    url: string;
}

interface UsersProps {
    className?: string;
}

const users: User[] = [
    {
        title: "Gladyce",
        avatar: "",
        url: "/message-center",
    },
    {
        title: "Elbert",
        avatar: "",
        url: "/message-center",
    },
    {
        title: "Joyce",
        avatar: "",
        url: "/message-center",
    },
];

const Users: React.FC<UsersProps> = ({ className }) => {
    return (
        <div className={`${className}`}>
            <div className="flex items-center justify-between mb-4 dark:bg-gray-600 rounded-lg dark:border-gray-700 border">
                <div className="text-gray-500">
                    Welcome <strong className="text-gray-900">857 customers</strong> with a personal message{" "}
                </div>
                <Link
                    href="/message-center"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                    Send<span className="ml-1">message</span>
                </Link>
            </div>
            <div className="flex flex-wrap gap-4 dark:bg-gray-600 rounded-lg border">
                {users.map((x, index) => (
                    <Link
                        key={index}
                        href={x.url}
                        className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-500"
                    >
                        <div className="w-12 h-12 rounded-full overflow-hidden mb-2">
                            <img src={x.avatar} alt="Avatar" className="w-full h-full object-cover" />
                        </div>
                        <div className="text-sm font-medium text-gray-900">{x.title}</div>
                    </Link>
                ))}
                <Link
                    href="/customers/customer-list"
                    className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-50"
                >
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                        <Icon category="interface" name="arrow-right" className="text-gray-500" />
                    </div>
                    <div className="text-sm font-medium text-gray-900">View all</div>
                </Link>
            </div>
        </div>
    );
};

export default Users;
