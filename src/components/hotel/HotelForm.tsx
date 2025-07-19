import { useState, useEffect } from "react";
import { message, Button } from "antd";
import Loader from "@/components/loader/page";
import { ArrowUpTrayIcon } from '@heroicons/react/24/outline';
import type { HotelFormState } from '@/types/hotel';

export default function HotelForm({
    initialValues,
    onSubmit,
    loading,
    isEdit = false,
    existingAvatarUrl = "",
    existingGalleryUrls = []
}: {
    initialValues: HotelFormState,
    onSubmit: (values: HotelFormState, avatarFile: File | null, galleryFiles: File[]) => Promise<void>,
    loading: boolean,
    isEdit?: boolean,
    existingAvatarUrl?: string,
    existingGalleryUrls?: string[]
}) {
    const [form, setForm] = useState<HotelFormState>(initialValues);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string>(existingAvatarUrl);
    const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
    const [galleryPreviews, setGalleryPreviews] = useState<string[]>(existingGalleryUrls);

    useEffect(() => {
        setForm(initialValues);
        setAvatarPreview(existingAvatarUrl);
        setGalleryPreviews(existingGalleryUrls);
    }, []);

    function toSlug(str: string) {
        return str
            .toLowerCase()
            .normalize('NFD')
            .replace(/[ -\u036f]/g, '')
            .replace(/[^a-z0-9 ]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-+|-+$/g, '');
    }

    useEffect(() => {
        setForm((prev) => ({
            ...prev,
            slug: toSlug(prev.displayName || ''),
        }));
    }, [form.displayName]);

    // Handle avatar upload
    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };
    // Handle gallery upload
    const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const newFiles = [...galleryFiles, ...files].slice(0, 20);
        setGalleryFiles(newFiles);
        // Combine existing URLs with new file previews
        const existingUrls = existingGalleryUrls.slice(0, 20 - newFiles.length);
        const newPreviews = newFiles.map(f => URL.createObjectURL(f));
        setGalleryPreviews([...existingUrls, ...newPreviews]);
    };

    const handleRemoveGallery = (idx: number) => {
        // Check if this is an existing image or a new uploaded image
        const existingCount = existingGalleryUrls.length;
        const newFilesCount = galleryFiles.length;

        if (idx < existingCount) {
            message.info('Ảnh hiện tại sẽ được giữ nguyên. Bạn có thể thay thế bằng ảnh mới bằng cách kéo thả.');
            return;
        }

        // Removing a new uploaded image
        const newFileIdx = idx - existingCount;
        const newFiles = galleryFiles.filter((_, i) => i !== newFileIdx);
        setGalleryFiles(newFiles);
        // Recalculate previews: existing URLs + new file previews
        const existingUrls = existingGalleryUrls.slice(0, 20 - newFiles.length);
        const newPreviews = newFiles.map(f => URL.createObjectURL(f));
        setGalleryPreviews([...existingUrls, ...newPreviews]);
    };

    // Drag & drop for avatar
    const handleAvatarDrop = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        const file = e.dataTransfer.files?.[0];
        if (file) {
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };
    // Drag & drop for gallery
    const handleGalleryDrop = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        const files = Array.from(e.dataTransfer.files || []);
        const newFiles = [...galleryFiles, ...files].slice(0, 20);
        setGalleryFiles(newFiles);
        // Combine existing URLs with new file previews
        const existingUrls = existingGalleryUrls.slice(0, 20 - newFiles.length);
        const newPreviews = newFiles.map(f => URL.createObjectURL(f));
        setGalleryPreviews([...existingUrls, ...newPreviews]);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === "checkbox" && e.target instanceof HTMLInputElement) {
            setForm((prev: HotelFormState) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
        } else {
            setForm((prev: HotelFormState) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSubmit(form, avatarFile, galleryFiles);
    };

    const handleReset = () => {
        setForm(initialValues);
        setAvatarFile(null);
        setAvatarPreview(existingAvatarUrl);
        setGalleryFiles([]);
        setGalleryPreviews(existingGalleryUrls);
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-600 rounded-lg border border-gray-200 mt-8">
            {/* Hàng 1: Tên khách sạn, Địa chỉ */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 px-6 mt-6">
                <div>
                    <label className="block text-sm font-semibold mb-1 text-blue-700">Tên khách sạn <span className="text-red-500">*</span></label>
                    <input name="displayName" value={form.displayName} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" required />
                </div>
                <div>
                    <label className="block text-sm font-semibold mb-1 text-blue-700">Địa chỉ <span className="text-red-500">*</span></label>
                    <input name="region" value={form.region} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" required />
                </div>
            </div>
            {/* Hàng 2: Số sao, Giá, Latitude, Longitude */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-x-6 gap-y-4 px-6 mt-6">
                <div>
                    <label className="block text-sm font-semibold mb-1 text-blue-700">Số sao</label>
                    <input name="starRating" value={form.starRating} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" type="number" />
                </div>
                <div>
                    <label className="block text-sm font-semibold mb-1 text-blue-700">Giá (VND) <span className="text-red-500">*</span></label>
                    <input name="price" value={form.price} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" type="number" required />
                </div>
                <div>
                    <label className="block text-sm font-semibold mb-1 text-blue-700">Latitude</label>
                    <input name="latitude" value={form.latitude} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" type="number" step="any" />
                </div>
                <div>
                    <label className="block text-sm font-semibold mb-1 text-blue-700">Longitude</label>
                    <input name="longitude" value={form.longitude} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" type="number" step="any" />
                </div>
            </div>
            {/* Hàng 3: Đánh giá người dùng, Thông tin đánh giá, Trạng thái khách sạn, Số lượt đánh giá */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-x-6 gap-y-4 px-6 mt-6">
                <div>
                    <label className="block text-sm font-semibold mb-1 text-blue-700">Đánh giá người dùng</label>
                    <input name="userRating" value={form.userRating} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" type="number" step="any" />
                </div>
                <div>
                    <label className="block text-sm font-semibold mb-1 text-blue-700">Số lượt đánh giá</label>
                    <input name="numReviews" value={form.numReviews} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" type="number" />
                </div>
                <div>
                    <label className="block text-sm font-semibold mb-1 text-blue-700">Thông tin đánh giá</label>
                    <select name="satisfactionInfo" value={form.satisfactionInfo} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400">
                        <option value="">Chọn mức độ hài lòng</option>
                        <option value="Tốt">Tốt</option>
                        <option value="Rất tốt">Rất tốt</option>
                        <option value="Tuyệt vời">Tuyệt vời</option>
                        <option value="Hài lòng">Hài lòng</option>
                        <option value="Trung bình">Trung bình</option>
                        <option value="Kém">Kém</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-semibold mb-1 text-blue-700">Trạng thái khách sạn</label>
                    <select name="is_active" value={form.is_active ? "Active" : "Inactive"} onChange={e => setForm(prev => ({ ...prev, is_active: e.target.value === "Active" }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400">
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                </div>
            </div>
            {/* Hàng 4: Mô tả khách sạn */}
            <div className="grid grid-cols-1 gap-x-6 gap-y-4 px-6 mt-6">
                <div>
                    <label className="block text-sm font-semibold mb-1 text-blue-700">Thông tin mô tả khách sạn</label>
                    <textarea
                        name="description"
                        value={form.description || ''}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 min-h-[80px]"
                        rows={3}
                        placeholder="Nhập mô tả ngắn về khách sạn, vị trí, tiện ích nổi bật..."
                    />
                </div>
            </div>
            {/* Ảnh đại diện: upload + preview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-6 mt-6 items-stretch">
                {/* Ảnh đại diện */}
                <div className="flex flex-col h-full justify-between">
                    <label className="block text-sm font-semibold mb-1 text-blue-700">Ảnh đại diện <span className="text-red-500">*</span></label>
                    <label
                        className="flex flex-col items-center justify-center w-full h-full min-h-[128px] border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors flex-1 relative"
                        onDragOver={e => { e.preventDefault(); e.stopPropagation(); }}
                        onDrop={handleAvatarDrop}
                    >
                        {avatarPreview ? (
                            <div className="relative">
                                <img src={avatarPreview} alt="Preview" className="w-32 h-24 object-cover rounded-lg border border-gray-200" />
                                <button
                                    type="button"
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                                    onClick={e => { e.stopPropagation(); setAvatarFile(null); setAvatarPreview(""); }}
                                >×</button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full">
                                <ArrowUpTrayIcon className="w-8 h-8 text-blue-400 mb-2" />
                                <span className="text-gray-400 text-sm">Chọn hoặc kéo thả ảnh đại diện</span>
                            </div>
                        )}
                        <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                    </label>
                </div>
                {/* Tiện ích */}
                <div className="flex flex-col h-full justify-between">
                    <label className="block text-sm font-semibold mb-1 text-blue-700">Tiện ích (cách nhau dấu phẩy)</label>
                    <textarea name="hotelFeatures" value={form.hotelFeatures} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 min-h-[128px]" rows={2} placeholder="Wifi, Hồ bơi, Đưa đón sân bay..." />
                </div>
            </div>
            {/* Ảnh chi tiết: upload nhiều ảnh, preview, hướng dẫn */}
            <div className="px-6 mt-6">
                <label className="block text-sm font-semibold mb-1 text-blue-700">Ảnh chi tiết (tối đa 20 ảnh)</label>
                <label
                    className="flex flex-col items-center justify-center w-full min-h-[128px] border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors relative"
                    onDragOver={e => { e.preventDefault(); e.stopPropagation(); }}
                    onDrop={handleGalleryDrop}
                >
                    {/* Preview gallery images nếu có */}
                    {galleryPreviews.length > 0 && (
                        <div className="flex gap-4 flex-wrap justify-center mb-2 w-full">
                            {galleryPreviews.map((src, idx) => (
                                <div key={idx} className="relative">
                                    <img
                                        src={src}
                                        alt={`Preview ${idx + 1}`}
                                        className="w-40 h-32 object-cover rounded border"
                                    />
                                    <button
                                        type="button"
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                                        onClick={e => { e.stopPropagation(); handleRemoveGallery(idx); }}
                                    >×</button>
                                </div>
                            ))}
                        </div>
                    )}
                    {/* Icon upload và hướng dẫn */}
                    <div className="flex flex-col items-center justify-center h-full">
                        <ArrowUpTrayIcon className="w-8 h-8 text-blue-400 mb-2" />
                        <span className="text-gray-400 text-sm">Chọn hoặc kéo thả tối đa 20 ảnh</span>
                    </div>
                    <input type="file" accept="image/*" multiple className="hidden" onChange={handleGalleryChange} />
                </label>
            </div>
            <div className="flex justify-end mt-8 p-6 gap-3">
                <button
                    type="button"
                    className="flex items-center gap-1 px-3 py-1.5 rounded bg-blue-100 hover:bg-blue-200 text-blue-700 text-sm font-semibold border border-blue-300 transition"
                    onClick={handleReset}
                    title="Làm lại tất cả các trường"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12a9.75 9.75 0 111.5 5.25M2.25 12V7.5m0 4.5h4.5" />
                    </svg>
                    Làm lại
                </button>
                <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                >
                    {isEdit ? "Lưu thay đổi" : "Lưu"}
                </Button>
            </div>
        </form>
    );
} 
