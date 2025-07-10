"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaPlus } from "react-icons/fa";

const baseUrl = process.env.NEXT_PUBLIC_CMS_URL || 'http://localhost:8086';

interface ContentBlock {
    type: 'heading' | 'image' | 'paragraph';
    text?: string;
    src?: string;
    alt?: string;
}

interface AddPostFormProps {
    onSuccess?: () => void;
    showForm?: boolean;
    setShowForm?: (show: boolean) => void;
    initialData?: any;
    onClose?: () => void;
    children?: React.ReactNode;
}

const AddPostForm: React.FC<AddPostFormProps> = ({ onSuccess, showForm: showFormProp, setShowForm: setShowFormProp, initialData, onClose, children }) => {
    const [formData, setFormData] = useState({
        title: "",
        image: "",
        author: "",
        status: "draft",
        content: [] as ContentBlock[]
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [internalShowForm, internalSetShowForm] = useState(false);
    const showForm = showFormProp !== undefined ? showFormProp : internalShowForm;
    const setShowForm = setShowFormProp !== undefined ? setShowFormProp : internalSetShowForm;
    const router = useRouter();

    // Khi initialData thay đổi (bấm Sửa), fill vào form
    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title || "",
                image: initialData.image || "",
                author: initialData.author || "",
                status: initialData.status || "draft",
                content: Array.isArray(initialData.content) ? initialData.content : []
            });
        } else {
            setFormData({
                title: "",
                image: "",
                author: "",
                status: "draft",
                content: []
            });
        }
    }, [initialData]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const addContentBlock = (type: ContentBlock['type']) => {
        const newBlock: ContentBlock = { type };
        setFormData(prev => ({
            ...prev,
            content: [...prev.content, newBlock]
        }));
    };

    const updateContentBlock = (index: number, field: keyof ContentBlock, value: string) => {
        setFormData(prev => ({
            ...prev,
            content: prev.content.map((block, i) =>
                i === index ? { ...block, [field]: value } : block
            )
        }));
    };

    const removeContentBlock = (index: number) => {
        setFormData(prev => ({
            ...prev,
            content: prev.content.filter((_, i) => i !== index)
        }));
    };

    const moveContentBlock = (index: number, direction: 'up' | 'down') => {
        setFormData(prev => {
            const newContent = [...prev.content];
            if (direction === 'up' && index > 0) {
                [newContent[index], newContent[index - 1]] = [newContent[index - 1], newContent[index]];
            } else if (direction === 'down' && index < newContent.length - 1) {
                [newContent[index], newContent[index + 1]] = [newContent[index + 1], newContent[index]];
            }
            return { ...prev, content: newContent };
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            let response;
            if (initialData && initialData._id) {
                // EDIT: Gọi PUT qua Next.js API route bằng ID
                response = await fetch(`/api/blogs/${initialData._id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        ...formData,
                        date: new Date().toISOString()
                    }),
                });
            } else {
                // CREATE: Gọi POST 
                response = await fetch(`${baseUrl}/api/blogs`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        ...formData,
                        date: new Date().toISOString()
                    }),
                });
            }

            if (!response.ok) {
                throw new Error('Failed to save post');
            }

            const result = await response.json();

            // Reset form
            setFormData({
                title: "",
                image: "",
                author: "",
                status: "draft",
                content: []
            });
            setLoading(false);
            if (onClose) onClose();
            if (onSuccess) onSuccess();
            router.refresh();

        } catch (err) {
            setError("Có lỗi xảy ra khi lưu bài viết. Vui lòng thử lại.");
            setLoading(false);
        }
    };

    const renderContentBlock = (block: ContentBlock, index: number) => {
        return (
            <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50 dark:bg-gray-600">
                <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {block.type === 'heading' ? 'Tiêu đề' :
                            block.type === 'image' ? 'Hình ảnh' : 'Đoạn văn'}
                    </span>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => moveContentBlock(index, 'up')}
                            disabled={index === 0}
                            className="p-2 text-2xl text-gray-500 hover:text-gray-700 disabled:opacity-50"
                        >
                            ↑
                        </button>
                        <button
                            type="button"
                            onClick={() => moveContentBlock(index, 'down')}
                            disabled={index === formData.content.length - 1}
                            className="p-2 text-2xl text-gray-500 hover:text-gray-700 disabled:opacity-50"
                        >
                            ↓
                        </button>
                        <button
                            type="button"
                            onClick={() => removeContentBlock(index)}
                            className="p-2 text-2xl text-red-500 hover:text-red-700"
                        >
                            ×
                        </button>
                    </div>
                </div>

                {block.type === 'heading' && (
                    <input
                        type="text"
                        value={block.text || ''}
                        onChange={(e) => updateContentBlock(index, 'text', e.target.value)}
                        placeholder="Nhập tiêu đề..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-500 dark:border-gray-400 dark:text-white"
                    />
                )}

                {block.type === 'paragraph' && (
                    <textarea
                        value={block.text || ''}
                        onChange={(e) => updateContentBlock(index, 'text', e.target.value)}
                        placeholder="Nhập nội dung đoạn văn..."
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-500 dark:border-gray-400 dark:text-white"
                    />
                )}

                {block.type === 'image' && (
                    <div className="space-y-3">
                        <input
                            type="url"
                            value={block.src || ''}
                            onChange={(e) => updateContentBlock(index, 'src', e.target.value)}
                            placeholder="URL hình ảnh..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-500 dark:border-gray-400 dark:text-white"
                        />
                        <input
                            type="text"
                            value={block.alt || ''}
                            onChange={(e) => updateContentBlock(index, 'alt', e.target.value)}
                            placeholder="Mô tả hình ảnh (alt text)..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-500 dark:border-gray-400 dark:text-white"
                        />
                        {block.src && (
                            <div className="mt-2">
                                <img
                                    src={block.src}
                                    alt={block.alt || 'Preview'}
                                    className="w-32 h-20 object-cover rounded-lg border"
                                    onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                    }}
                                />
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    };

    return (
        <>
            {showForm && (
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2 mb-2">
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Tiêu đề bài viết *
                            </label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                                placeholder="Nhập tiêu đề bài viết..."
                            />
                        </div>
                        <div className="flex flex-col gap-2 mb-2">
                            <label htmlFor="author" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Tác giả *
                            </label>
                            <input
                                type="text"
                                id="author"
                                name="author"
                                value={formData.author}
                                onChange={handleInputChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                                placeholder="Nhập tên tác giả..."
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 mb-2">
                        <label htmlFor="image" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            URL ảnh đại diện *
                        </label>
                        <input
                            type="url"
                            id="image"
                            name="image"
                            value={formData.image}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                            placeholder="https://example.com/image.jpg"
                        />
                        {formData.image && (
                            <div className="mt-2">
                                <img
                                    src={formData.image}
                                    alt="Preview"
                                    className="w-32 h-20 object-cover rounded-lg border"
                                    onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                    }}
                                />
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col gap-2 mb-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Nội dung bài viết *
                        </label>
                        <div className="space-y-4">
                            {formData.content.map((block, index) => renderContentBlock(block, index))}

                            <div className="flex gap-2 flex-wrap">
                                <button
                                    type="button"
                                    onClick={() => addContentBlock('heading')}
                                    className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
                                >
                                    + Tiêu đề
                                </button>
                                <button
                                    type="button"
                                    onClick={() => addContentBlock('paragraph')}
                                    className="px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm"
                                >
                                    + Đoạn văn
                                </button>
                                <button
                                    type="button"
                                    onClick={() => addContentBlock('image')}
                                    className="px-3 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm"
                                >
                                    + Hình ảnh
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 mb-2">
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Trạng thái
                        </label>
                        <select
                            id="status"
                            name="status"
                            value={formData.status}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                        >
                            <option value="draft">Nháp</option>
                            <option value="published">Đã đăng</option>
                            <option value="archived">Đã lưu trữ</option>
                        </select>
                    </div>

                    <div className="flex gap-4 pt-4 justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Đang tạo...
                                </>
                            ) : (
                                <>
                                    {initialData ? "Lưu thay đổi" : "Tạo bài viết"}
                                </>
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                        >
                            Hủy
                        </button>
                    </div>
                    {children}
                </form>
            )}
        </>
    );
};

export default AddPostForm; 
