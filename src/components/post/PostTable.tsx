"use client";

import React, { useState } from 'react';
import { message } from 'antd';
import Loader from '@/components/loader/page';
import Image from 'next/image';

interface Post {
    _id: string;
    slug: string;
    title: string;
    image: string;
    description?: string;
    date: string;
    status: string;
    author: string;
    link?: string;
}

function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });
}

type PostTableProps = {
    posts: Post[];
    loading?: boolean;
    onShowForm?: () => void;
    onEdit?: (post: Post) => void;
    editingId?: string;
    onDelete?: () => void;
};

const PostTable: React.FC<PostTableProps> = ({ posts, loading, onShowForm, onEdit, editingId, onDelete }) => {
    const [page, setPage] = useState(1);
    const [selected, setSelected] = useState<string[]>([]);
    const [showConfirm, setShowConfirm] = useState(false);
    const [postToDelete, setPostToDelete] = useState<Post | null>(null);
    const [error, setError] = useState<string | null>(null);

    const pageSize = 10;
    const totalPages = Math.ceil(posts.length / pageSize);
    const pagedPosts = posts.slice((page - 1) * pageSize, page * pageSize);

    const allChecked = selected.length === pagedPosts.length && pagedPosts.length > 0;
    const isIndeterminate = selected.length > 0 && selected.length < pagedPosts.length;

    const handleCheckAll = () => {
        if (allChecked) setSelected([]);
        else setSelected(pagedPosts.map((b) => b._id));
    };

    const handleCheck = (id: string) => {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    const handleDelete = async (post: Post) => {
        let hide = message.loading('Đang xóa bài viết...', 0);
        try {
            const res = await fetch(`/api/blogs/${post._id}`, { method: 'DELETE' });
            if (res.ok) {
                message.success('Xóa bài viết thành công!');
                if (onDelete) onDelete();
            } else {
                message.error('Xóa bài viết thất bại!');
            }
        } catch (e) {
            message.error('Có lỗi khi xóa bài viết!');
        } finally {
            hide();
            setShowConfirm(false);
            setPostToDelete(null);
        }
    };

    if (error) return <div>{error}</div>;
    if (loading) return <Loader />;
    if (!posts || posts.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[200px] py-8">
                <svg width="64" height="64" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-gray-300 mb-4">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" />
                </svg>
                <div className="text-lg text-gray-500 font-semibold mb-2">Không có bài viết nào phù hợp</div>
                <div className="text-gray-400 mb-4">Hãy thử chọn trạng thái khác hoặc tạo bài viết mới.</div>
                <button onClick={onShowForm} className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Tạo bài viết mới</button>
            </div>
        );
    }

    return (
        <div>
            {showConfirm && postToDelete && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center"
                    style={{ background: "rgba(50, 55, 62, 0.7)" }}
                >
                    <div className="bg-blue-50 rounded-xl shadow-lg p-8 w-full max-w-sm border border-blue-200 flex flex-col items-center">
                        <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-red-400 mb-4">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 9 4.03 9 9z" />
                        </svg>
                        <div className="text-lg font-semibold text-red-600 mb-2 text-center">Bạn có chắc muốn xóa bài viết này?</div>
                        <div className="text-blue-500 mb-6 text-center">"{postToDelete.title}"</div>
                        <div className="flex gap-4 w-full justify-center">
                            <button
                                className="px-5 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                                onClick={() => postToDelete && handleDelete(postToDelete)}
                            >
                                Xác nhận
                            </button>
                            <button
                                className="px-5 py-2 rounded-lg bg-blue-100 text-blue-700 font-semibold hover:bg-blue-200 transition"
                                onClick={() => {
                                    setShowConfirm(false);
                                    setPostToDelete(null);
                                }}
                            >
                                Hủy
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <div className="overflow-x-auto rounded-xl shadow bg-white dark:bg-gray-700 max-w-full mt-4">
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
                            <th className="p-3">Ảnh</th>
                            <th className="p-3 max-w-[200px] w-48">Tiêu đề</th>
                            <th className="p-3 text-center">Ngày đăng</th>
                            <th className="p-3 text-center">Trạng thái</th>
                            <th className="p-3 text-center">Tác giả</th>
                            <th className="p-3">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pagedPosts.map((b, idx) => {
                            return (
                                <tr
                                    key={b._id || idx}
                                    className={`border-t hover:bg-gray-50 dark:hover:bg-gray-600 transition group
                                        ${editingId === b._id ? 'bg-blue-50 border-blue-400' : ''}`}
                                >
                                    <td className="p-3 text-center">
                                        <input
                                            type="checkbox"
                                            checked={selected.includes(b._id)}
                                            onChange={() => handleCheck(b._id)}
                                            className="accent-blue-500 w-4 h-4"
                                        />
                                    </td>
                                    <td className="p-3">
                                        <div className="flex justify-center items-center">
                                            <Image
                                                src={b.image}
                                                alt={b.title}
                                                width={128}
                                                height={80}
                                                className="w-32 h-20 object-cover rounded-lg border"
                                                loading="lazy"
                                            />
                                        </div>
                                    </td>
                                    <td className="p-3 font-medium max-w-[180px] w-48 truncate" title={b.title}>{b.title}</td>
                                    <td className="p-3 whitespace-nowrap text-center">{formatDate(b.date)}</td>
                                    <td className="p-3 text-center">
                                        {{
                                            published: <span className="px-2 py-1 rounded text-xs font-semibold bg-green-100 text-green-700">Đã đăng</span>,
                                            draft: <span className="px-2 py-1 rounded text-xs font-semibold bg-yellow-100 text-yellow-700">Nháp</span>,
                                            archived: <span className="px-2 py-1 rounded text-xs font-semibold bg-gray-200 text-gray-700">Đã lưu trữ</span>,
                                            deleted: <span className="px-2 py-1 rounded text-xs font-semibold bg-red-100 text-red-700">Đã xóa</span>,
                                        }[String(b.status)] || null}
                                    </td>
                                    <td className="p-3 whitespace-nowrap text-center">{b.author}</td>
                                    <td className="p-3 h-20 align-middle">
                                        <div className="flex gap-2 items-center justify-center h-full">
                                            <button
                                                className="px-3 py-1 rounded-full border border-blue-200 bg-blue-50 text-blue-700 font-semibold text-xs hover:bg-blue-100 transition"
                                                onClick={() => {
                                                    window.location.href = `/tin-tuc/${b.slug}`;
                                                }}
                                            >
                                                Xem
                                            </button>
                                            <button
                                                className="px-3 py-1 rounded-full border border-yellow-200 bg-yellow-50 text-yellow-700 font-semibold text-xs hover:bg-yellow-100 transition"
                                                onClick={() => onEdit && onEdit(b)}
                                            >
                                                Sửa
                                            </button>
                                            <button
                                                className="px-3 py-1 rounded-full border border-red-200 bg-red-50 text-red-700 font-semibold text-xs hover:bg-red-100 transition"
                                                onClick={() => {
                                                    setPostToDelete(b);
                                                    setShowConfirm(true);
                                                }}
                                            >
                                                Xóa
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            {totalPages > 1 && (
                <div className="flex justify-end mt-4 gap-2">
                    <button
                        className="px-3 py-1 rounded-full text-sm font-semibold text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                        onClick={() => setPage(page - 1)}
                        disabled={page === 1}
                    >
                        Prev
                    </button>
                    {[...Array(totalPages)].map((_, idx) => (
                        <button
                            key={idx}
                            className={`px-3 py-1 rounded-full text-sm font-semibold transition ${page === idx + 1 ? 'bg-blue-600 text-white shadow' : 'text-gray-700 hover:bg-blue-100'}`}
                            onClick={() => setPage(idx + 1)}
                        >
                            {idx + 1}
                        </button>
                    ))}
                    <button
                        className="px-3 py-1 rounded-full text-sm font-semibold text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                        onClick={() => setPage(page + 1)}
                        disabled={page === totalPages}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default PostTable; 
