"use client";

import React, { useState } from "react";

// Dữ liệu mẫu (mock)
const mockUsers = [
    {
        id: 1,
        document_id: "a1b2c3d4-e5f6-7890-1234-56789abcdef0",
        username: "johndoe",
        email: "john@example.com",
        first_name: "John",
        last_name: "Doe",
        full_name: "John Doe",
        gender: 1,
        avatar: "https://randomuser.me/api/portraits/men/1.jpg",
        phone: "0123456789",
        dob: "1990-01-01",
        is_activated: true,
        is_deleted: false,
        created_at: "2023-01-01 10:00:00",
    },
    {
        id: 2,
        document_id: "b2c3d4e5-f6a7-8901-2345-6789abcdef01",
        username: "janesmith",
        email: "jane@example.com",
        first_name: "Jane",
        last_name: "Smith",
        full_name: "Jane Smith",
        gender: 2,
        avatar: "https://randomuser.me/api/portraits/women/2.jpg",
        phone: "0987654321",
        dob: "1992-05-10",
        is_activated: false,
        is_deleted: false,
        created_at: "2023-02-15 14:30:00",
    },
];

const genderMap = {
    1: "Nam",
    2: "Nữ",
    3: "Khác",
};

const UserTable = () => {
    const [selected, setSelected] = useState<number[]>([]);
    const allChecked = selected.length === mockUsers.length && mockUsers.length > 0;
    const isIndeterminate = selected.length > 0 && selected.length < mockUsers.length;

    const handleCheckAll = () => {
        if (allChecked) setSelected([]);
        else setSelected(mockUsers.map((u) => u.id));
    };

    const handleCheck = (id: number) => {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    return (
        <div className="overflow-x-auto rounded-xl shadow bg-white dark:bg-gray-700 max-w-full">
            <table className="min-w-max w-full text-sm">
                <thead>
                    <tr className="bg-gray-50 dark:bg-gray-700 text-gray-600 uppercase text-xs">
                        <th className="p-3 text-center">
                            <input
                                type="checkbox"
                                checked={allChecked}
                                ref={el => {
                                    if (el) el.indeterminate = isIndeterminate;
                                }}
                                onChange={handleCheckAll}
                                className="accent-blue-500 w-4 h-4"
                            />
                        </th>
                        <th className="p-3">Avatar</th>
                        <th className="p-3">Username</th>
                        <th className="p-3">Email</th>
                        <th className="p-3 hidden sm:table-cell">Họ tên</th>
                        <th className="p-3 hidden md:table-cell">Giới tính</th>
                        <th className="p-3 hidden md:table-cell">SĐT</th>
                        <th className="p-3 hidden lg:table-cell">Ngày sinh</th>
                        <th className="p-3 hidden lg:table-cell">Kích hoạt</th>
                        <th className="p-3 hidden xl:table-cell">Ngày tạo</th>
                    </tr>
                </thead>
                <tbody>
                    {mockUsers.map((u) => (
                        <tr
                            key={u.id}
                            className="border-b hover:bg-gray-50 dark:hover:bg-gray-600 transition group"
                        >
                            <td className="p-3 text-center">
                                <input
                                    type="checkbox"
                                    checked={selected.includes(u.id)}
                                    onChange={() => handleCheck(u.id)}
                                    className="accent-blue-500 w-4 h-4"
                                />
                            </td>
                            <td className="p-3">
                                <img
                                    src={u.avatar}
                                    alt={u.full_name}
                                    className="w-10 h-10 rounded-full object-cover border shadow"
                                />
                            </td>
                            <td className="p-3 font-medium">{u.username}</td>
                            <td className="p-3 truncate max-w-[120px]">{u.email}</td>
                            <td className="p-3 hidden sm:table-cell">{u.full_name}</td>
                            <td className="p-3 hidden md:table-cell">{genderMap[u.gender as 1 | 2 | 3] || "Khác"}</td>
                            <td className="p-3 hidden md:table-cell">{u.phone}</td>
                            <td className="p-3 hidden lg:table-cell">{u.dob}</td>
                            <td className="p-3 hidden lg:table-cell">
                                {u.is_activated ? (
                                    <span className="inline-block px-2 py-1 text-xs rounded bg-green-100 text-green-700">Active</span>
                                ) : (
                                    <span className="inline-block px-2 py-1 text-xs rounded bg-gray-200 text-gray-500">Inactive</span>
                                )}
                            </td>
                            <td className="p-3 hidden xl:table-cell">{u.created_at}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserTable; 