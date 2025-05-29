"use client";

import React, { useState } from "react";
import { posts as mockPosts } from '@/mocks/posts';

interface Post {
    title: string;
    date?: string;
}

interface PostTableProps {
    posts?: Post[];
}

const PostTable: React.FC<PostTableProps> = ({ posts }) => {
    // Nếu không truyền props thì lấy 3 bài viết đầu từ mock
    const data = posts || mockPosts.slice(0, 3).map(p => ({
        title: p.title,
        date: 'N/A',
    }));
    const [selected, setSelected] = useState<number[]>([]);
    const allChecked = selected.length === data.length && data.length > 0;
    const isIndeterminate = selected.length > 0 && selected.length < data.length;

    const handleCheckAll = () => {
        if (allChecked) setSelected([]);
        else setSelected(data.map((_, idx) => idx));
    };

    const handleCheck = (idx: number) => {
        setSelected((prev) =>
            prev.includes(idx) ? prev.filter((x) => x !== idx) : [...prev, idx]
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
                        <th className="p-3">Tiêu đề</th>
                        <th className="p-3 hidden sm:table-cell">Ngày đăng</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((b, idx) => (
                        <tr key={idx} className="border-t hover:bg-gray-50 dark:hover:bg-gray-600 transition group">
                            <td className="p-3 text-center">
                                <input
                                    type="checkbox"
                                    checked={selected.includes(idx)}
                                    onChange={() => handleCheck(idx)}
                                    className="accent-blue-500 w-4 h-4"
                                />
                            </td>
                            <td className="p-3 font-medium">
                                <span dangerouslySetInnerHTML={{ __html: b.title }} />
                            </td>
                            <td className="p-3 hidden sm:table-cell">{b.date || 'N/A'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PostTable; 
