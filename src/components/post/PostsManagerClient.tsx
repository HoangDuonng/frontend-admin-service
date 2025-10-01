"use client";

import PostTable from "@/components/post/PostTable";
import AddPostForm from "@/components/post/AddPostForm";
import { useEffect, useRef, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { message } from 'antd';

const STATUS_OPTIONS = [
    { value: "all", label: "Tất cả" },
    { value: "draft", label: "Nháp" },
    { value: "published", label: "Đã đăng" },
    { value: "archived", label: "Đã lưu trữ" },
    { value: "deleted", label: "Đã xóa" },
];

export default function PostsManagerClient() {
    const [status, setStatus] = useState("all");
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [postToEdit, setPostToEdit] = useState<any | null>(null);
    const formRef = useRef<HTMLDivElement>(null);

    const fetchPosts = () => {
        setLoading(true);
        let url = "/api/blogs";
        if (status !== "all") url = `/api/blogs/status/${status}`;
        fetch(url)
            .then((res) => res.json())
            .then((data) => {
                setPosts(data?.data || []);
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchPosts();
    }, [status]);

    const handleShowForm = () => {
        setShowForm(true);
        setTimeout(() => {
            formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 100);
    };

    const handleEdit = (post: any) => {
        setPostToEdit(post);
        setShowForm(true);
        setTimeout(() => {
            formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 100);
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setPostToEdit(null);
    };

    const handleFormSubmit = async (formData: any, isEdit: boolean, id?: string) => {
        let hide = message.loading(isEdit ? 'Đang lưu thay đổi...' : 'Đang tạo bài viết...', 0);
        try {
            let response;
            if (isEdit && id) {
                response = await fetch(`/api/blogs/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...formData, date: new Date().toISOString() }),
                });
            } else {
                response = await fetch(`/api/blogs`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...formData, date: new Date().toISOString() }),
                });
            }
            if (!response.ok) throw new Error('Lỗi khi lưu bài viết');
            message.success(isEdit ? 'Lưu thay đổi thành công!' : 'Tạo bài viết thành công!');
            fetchPosts();
            handleCloseForm();
        } catch (e) {
            message.error('Có lỗi xảy ra khi lưu bài viết.');
        } finally {
            hide();
        }
    };

    const handleDelete = async (id: string) => {
        let hide = message.loading('Đang xóa bài viết...', 0);
        try {
            const res = await fetch(`/api/blogs/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Lỗi khi xóa bài viết');
            message.success('Xóa bài viết thành công!');
            fetchPosts();
        } catch (e) {
            message.error('Có lỗi xảy ra khi xóa bài viết.');
        } finally {
            hide();
        }
    };

    return (
        <div className="w-full mx-auto mt-8">
            <h1 className="text-3xl font-extrabold mb-2 mt-6 text-center bg-gradient-to-r from-blue-400 to-blue-600 text-transparent bg-clip-text drop-shadow">
                Quản lý bài viết - Tin tức
            </h1>
            <p className="mb-8 text-gray-500 text-center max-w-2xl mx-auto leading-relaxed text-lg">
                Quản lý các bài viết blog/tin tức. Thêm, sửa, xóa, cập nhật trạng thái bài viết một cách dễ dàng.
            </p>
            <div className="w-full max-w-5xl mx-auto flex flex-col">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4 w-full">
                    <div className="flex-1">
                        {!showForm && (
                            <button
                                onClick={() => setShowForm(true)}
                                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm font-semibold flex items-center gap-2 shadow-none"
                            >
                                <span>Thêm bài viết</span> <FaPlus className="text-sm" />
                            </button>
                        )}
                        {showForm && (
                            <div ref={formRef} className="mb-8">
                                <AddPostForm
                                    showForm={showForm}
                                    setShowForm={setShowForm}
                                    initialData={postToEdit}
                                    onClose={handleCloseForm}
                                    onSuccess={fetchPosts} 
                                >
                                    <div className="flex justify-end mt-6">
                                        <div className="flex items-center gap-2">
                                            <label htmlFor="status-filter" className="font-medium text-gray-700">Lọc trạng thái:</label>
                                            <select
                                                id="status-filter"
                                                value={status}
                                                onChange={e => setStatus(e.target.value)}
                                                className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            >
                                                {STATUS_OPTIONS.map(opt => (
                                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </AddPostForm>
                            </div>
                        )}
                    </div>
                    {!showForm && (
                        <div className="flex items-center gap-2 md:mt-0 mt-2">
                            <label htmlFor="status-filter" className="font-medium text-gray-700">Lọc trạng thái:</label>
                            <select
                                id="status-filter"
                                value={status}
                                onChange={e => setStatus(e.target.value)}
                                className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                {STATUS_OPTIONS.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>
            </div>
            <PostTable
                posts={posts}
                loading={loading}
                onShowForm={handleShowForm}
                onEdit={handleEdit}
                editingId={postToEdit?._id}
                onDelete={fetchPosts}
            />
        </div>
    );
} 
