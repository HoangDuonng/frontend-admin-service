"use client";

import React, { useState, useEffect } from 'react';
import { Banner, BannerPosition, CreateBannerRequest } from '@/types/banner';
import { uploadBannerFile } from '@/services/bannerService';
import { Button, message } from 'antd';
import { FaImage, FaVideo } from 'react-icons/fa';
import dayjs from 'dayjs';


const BANNER_POSITIONS: { value: BannerPosition; label: string; description: string }[] = [
    { value: 'home_video_banner', label: 'Home Video Banner', description: 'Video banner lớn ở trang chủ' },
    { value: 'header_banner_1', label: 'Header Banner 1', description: 'Banner đầu tiên trong header' },
    { value: 'header_banner_2', label: 'Header Banner 2', description: 'Banner thứ hai trong header' },
    { value: 'header_banner_3', label: 'Header Banner 3', description: 'Banner thứ ba trong header' },
    { value: 'header_banner_4', label: 'Header Banner 4', description: 'Banner thứ tư trong header' },
    { value: 'header_banner_5', label: 'Header Banner 5', description: 'Banner thứ năm trong header' },
    { value: 'home_image_banner', label: 'Home Image Banner', description: 'Banner ảnh lớn ở trang chủ, phần marketing' },
];

const LANGUAGE_OPTIONS = [
    { value: 'vi', label: 'Tiếng Việt' },
    { value: 'en', label: 'English' },
];

const GROUP_OPTIONS = [
    { value: 'main-banners', label: 'Main Banners' },
    { value: 'sub-banners', label: 'Sub Banners' },
];

interface BannerFormProps {
    banner?: Banner;
    onSubmit: (data: CreateBannerRequest) => Promise<void>;
    onCancel: () => void;
    loading?: boolean;
}

export default function BannerForm({ banner, onSubmit, onCancel, loading = false }: BannerFormProps) {

    const [name, setName] = useState(banner?.name || '');
    const [title, setTitle] = useState(banner?.content?.title || '');
    const [buttonText, setButtonText] = useState(banner?.content?.buttonText || '');
    const [position, setPosition] = useState(banner?.position || 'header_banner_1');
    const [description, setDescription] = useState(banner?.content?.description || '');
    const [order, setOrder] = useState(banner?.order || 1);
    const [language, setLanguage] = useState(banner?.language || 'vi');
    const [group, setGroup] = useState(banner?.group || 'main-banners');
    const [display, setDisplay] = useState<any>(banner?.display ? [dayjs(banner.display.startDate), dayjs(banner.display.endDate)] : []);
    const [isVisible, setIsVisible] = useState<boolean>(banner?.display?.isVisible ?? true);
    const [buttonUrl, setButtonUrl] = useState(banner?.content?.buttonUrl || '');
    const [isActive, setIsActive] = useState<boolean>(banner?.isActive ?? true);
    const [imageUrl, setImageUrl] = useState<string>(banner?.content?.url || '');
    const [imageLoading, setImageLoading] = useState(false);
    const [errors, setErrors] = useState<any>({});
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');
    const [mediaType, setMediaType] = useState<'image' | 'video'>('image');

    useEffect(() => {
        if (banner) {
            setName(banner.name || '');
            setTitle(banner.content?.title || '');
            setButtonText(banner.content?.buttonText || '');
            setPosition(banner.position || 'header_banner_1');
            setDescription(banner.content?.description || '');
            setOrder(banner.order || 1);
            setLanguage(banner.language || 'vi');
            setGroup(banner.group || 'main-banners');
            const period = banner.display || (banner as any).display;
            setDisplay(period ? [dayjs(period.startDate), dayjs(period.endDate)] : []);
            let visible = true;
            if (period && typeof period === 'object' && 'isVisible' in period) {
                visible = Boolean((period as any)['isVisible']);
            }
            setIsVisible(visible);
            setButtonUrl(banner.content?.buttonUrl || '');
            setIsActive(banner.isActive ?? true);
            setImageUrl(banner.content?.url || '');
            // Xác định mediaType dựa vào url
            const url = banner.content?.url || '';
            if (/\.(mp4|webm|mov)$/i.test(url)) {
                setMediaType('video');
            } else {
                setMediaType('image');
            }
        } else {
            setName(''); setTitle(''); setButtonText(''); setPosition('header_banner_1'); setDescription(''); setOrder(1); setLanguage('vi'); setGroup('main-banners'); setDisplay([]); setIsVisible(true); setButtonUrl(''); setIsActive(true); setImageUrl('');
            setMediaType('image');
        }
    }, [banner]);

    const validate = () => {
        const newErrors: any = {};
        if (!name) newErrors.name = 'Vui lòng nhập tên banner';
        if (!title) newErrors.title = 'Vui lòng nhập tiêu đề';
        if (!position) newErrors.position = 'Vui lòng chọn vị trí';
        if (!order) newErrors.order = 'Vui lòng nhập thứ tự';
        if (!language) newErrors.language = 'Vui lòng chọn ngôn ngữ';
        if (!group) newErrors.group = 'Vui lòng chọn nhóm banner';
        if (!display || display.length !== 2) newErrors.display = 'Vui lòng chọn thời gian hiển thị';

        if (
            (!imagePreview && !imageUrl)
        ) {
            newErrors.media = 'Cần upload ít nhất 1 ảnh hoặc video';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const isValid = validate();
        if (!isValid) {
            console.log('[BannerForm] Validate lỗi, không submit');
            return;
        }
        let finalUrl = imageUrl;
        if (imageFile) {
            setImageLoading(true);
            let url = await uploadBannerFile(imageFile, mediaType === 'image' ? 'images' : 'videos');
            setImageLoading(false);
            if (url) finalUrl = url;
        }
        const dataToSend = {
            name,
            type: 'banner',
            position,
            content: {
                title,
                description,
                url: finalUrl,
                buttonText,
                buttonUrl,
            },
            language,
            isActive,
            order,
            display : {
                startDate: display[0]?.toISOString(),
                endDate: display[1]?.toISOString(),
                isVisible,
            },
            group,
        };
        try {
            const result = await onSubmit(dataToSend);
        } catch (error) {
            console.error('[BannerForm] Lỗi khi gọi onSubmit:', error);
            message.error('Có lỗi xảy ra');
        }
    };

    const handleImageUpload = async ({ file }: any) => {
        setImageLoading(true);
        const url = await uploadBannerFile(file, 'images');
        if (url) {
            setImageUrl(url);
            // form.setFieldsValue({ imageUrl: url }); // This line is removed as per the new_code
            message.success('Upload hình ảnh thành công!');
        } else {
            message.error('Không thể upload hình ảnh');
        }
        setImageLoading(false);
    };

    const handleVideoUpload = async ({ file }: any) => {
        setImageLoading(true);
        const url = await uploadBannerFile(file, 'videos');
        if (url) {
            setImageUrl(url);
            // form.setFieldsValue({ videoUrl: url }); // This line is removed as per the new_code
            message.success('Upload video thành công!');
        } else {
            message.error('Không thể upload video');
        }
        setImageLoading(false);
    };

    // Hàm reset form
    const handleReset = () => {
        setName('');
        setTitle('');
        setButtonText('');
        setPosition('header_banner_1');
        setDescription('');
        setOrder(1);
        setLanguage('vi');
        setGroup('main-banners');
        setDisplay([]);
        setIsVisible(true);
        setButtonUrl('');
        setIsActive(true);
        setImageUrl('');
        setImageFile(null);
        setImagePreview('');
        setErrors({});
    };

    const handleMediaTypeChange = (type: 'image' | 'video') => {
        setMediaType(type);
        if (type === 'image') {
            setImageFile(null);
            setImagePreview('');
        } else {
            setImageFile(null);
            setImagePreview('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow space-y-4">
            <div>
                <label className="block font-semibold mb-1 text-gray-800">Tên banner <span className="text-red-500">*</span></label>
                <input className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" value={name} onChange={e => { setName(e.target.value); }} />
                {errors.name && <div className="text-red-500 text-xs mt-1">{errors.name}</div>}
            </div>
            <div>
                <label className="block font-semibold mb-1 text-gray-800">Tiêu đề chính <span className="text-red-500">*</span></label>
                <input className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" value={title} onChange={e => setTitle(e.target.value)} />
                {errors.title && <div className="text-red-500 text-xs mt-1">{errors.title}</div>}
            </div>
            <div>
                <label className="block font-semibold mb-1 text-gray-800">Tiêu đề phụ</label>
                <input className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" value={buttonText} onChange={e => setButtonText(e.target.value)} />
            </div>
            <div>
                <label className="block font-semibold mb-1 text-gray-800">Vị trí <span className="text-red-500">*</span></label>
                <select className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" value={position} onChange={e => setPosition(e.target.value)}>
                    {BANNER_POSITIONS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                </select>
                {errors.position && <div className="text-red-500 text-xs mt-1">{errors.position}</div>}
            </div>
            <div>
                <label className="block font-semibold mb-1 text-gray-800">Mô tả</label>
                <textarea className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" value={description} onChange={e => setDescription(e.target.value)} />
            </div>
            <div>
                <label className="block font-semibold mb-1 text-gray-800">Thứ tự <span className="text-red-500">*</span></label>
                <input type="number" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" value={order} onChange={e => setOrder(Number(e.target.value))} min={1} />
                {errors.order && <div className="text-red-500 text-xs mt-1">{errors.order}</div>}
            </div>
            <div>
                <label className="block font-semibold mb-1 text-gray-800">Ngôn ngữ <span className="text-red-500">*</span></label>
                <select className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" value={language} onChange={e => setLanguage(e.target.value)}>
                    {LANGUAGE_OPTIONS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
                </select>
                {errors.language && <div className="text-red-500 text-xs mt-1">{errors.language}</div>}
            </div>
            <div>
                <label className="block font-semibold mb-1 text-gray-800">Nhóm banner <span className="text-red-500">*</span></label>
                <select className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" value={group} onChange={e => setGroup(e.target.value)}>
                    {GROUP_OPTIONS.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
                </select>
                {errors.group && <div className="text-red-500 text-xs mt-1">{errors.group}</div>}
            </div>
            <div>
                <label className="block font-semibold mb-1 text-gray-800">Thời gian hiển thị <span className="text-red-500">*</span></label>
                <div className="flex items-center gap-2">
                    <input type="date" className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" value={display[0] ? dayjs(display[0]).format('YYYY-MM-DD') : ''} onChange={e => setDisplay([dayjs(e.target.value), display[1]])} />
                    <span className="mx-2">→</span>
                    <input type="date" className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" value={display[1] ? dayjs(display[1]).format('YYYY-MM-DD') : ''} onChange={e => setDisplay([display[0], dayjs(e.target.value)])} />
                    <div className="flex items-center ml-4">
                        <input type="checkbox" id="isVisible" checked={isVisible} onChange={e => setIsVisible(e.target.checked)} className="mr-2" />
                        <label htmlFor="isVisible" className="text-sm">Hiển thị (isVisible)</label>
                    </div>
                </div>
                {errors.display && <div className="text-red-500 text-xs mt-1">{errors.display}</div>}
            </div>
            <div>
                <label className="block font-semibold mb-1 text-gray-800">URL chuyển hướng khi click</label>
                <input className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" value={buttonUrl} onChange={e => setButtonUrl(e.target.value)} />
            </div>
            {/* Upload ảnh/video */}
            <div className="flex gap-4 mb-2">
                <label className="block font-semibold mb-1 text-gray-800">Loại file</label>
                <label className="flex items-center gap-1">
                    <input type="radio" checked={mediaType === 'image'} onChange={() => handleMediaTypeChange('image')} /> Ảnh
                </label>
                <label className="flex items-center gap-1">
                    <input type="radio" checked={mediaType === 'video'} onChange={() => handleMediaTypeChange('video')} /> Video
                </label>
            </div>
            <div className="mb-4">
                {mediaType === 'image' ? (
                    <>
                        <label className="block font-semibold mb-1 text-gray-800">Upload hình ảnh <span className="text-red-500">*</span></label>
                        <div className="flex items-center gap-2 mt-1">
                            <Button icon={<FaImage />} loading={imageLoading} onClick={e => { e.preventDefault(); document.getElementById('banner-image-upload')?.click(); }}>Upload Ảnh</Button>
                            <input id="banner-image-upload" type="file" accept="image/*" style={{ display: 'none' }}
                                onChange={e => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        setImageFile(file);
                                        setImagePreview(URL.createObjectURL(file));
                                    } else {
                                        setImagePreview('');
                                    }
                                }}
                            />
                        </div>
                        <div className="mt-2">
                            <img src={imagePreview || imageUrl || '/images/default.webp'} alt="Preview" className="w-full h-32 object-cover rounded border" />
                        </div>
                        <span className="text-xs text-gray-500">(Ảnh đẹp nhất: 1920 x 800 px)</span>
                    </>
                ) : (
                    <>
                        <label className="block font-semibold mb-1 text-gray-800">Upload video (cho video banner) <span className="text-red-500">*</span></label>
                        <div className="flex items-center gap-2 mt-1">
                            <Button icon={<FaVideo />} loading={imageLoading} onClick={e => { e.preventDefault(); document.getElementById('banner-video-upload')?.click(); }}>Upload Video</Button>
                            <input id="banner-video-upload" type="file" accept="video/*" style={{ display: 'none' }}
                                onChange={e => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        setImageFile(file);
                                        setImagePreview(URL.createObjectURL(file));
                                    } else {
                                        setImagePreview('');
                                    }
                                }}
                            />
                        </div>
                        <div className="mt-2">
                            {imagePreview || imageUrl ? (
                                <video src={imagePreview || imageUrl} controls className="w-full h-32 object-cover rounded border" />
                            ) : (
                                <div className="w-full h-32 flex items-center justify-center bg-gray-100 rounded border text-gray-400">
                                    <FaVideo size={32} />
                                    <span className="ml-2">Chưa có video</span>
                                </div>
                            )}
                            <span className="text-xs text-gray-500">(Video đẹp nhất: 1920 x 800 px)</span>
                        </div>
                    </>
                )}
            </div>
            {errors.media && <div className="text-red-500 text-xs mb-2">{errors.media}</div>}
            <div className="mb-3">
                <label className="block font-semibold mb-1 text-gray-800">Trạng thái <span className="text-red-500">*</span></label>
                <input type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)} />
                <span className="ml-2">{isActive ? 'Hoạt động' : 'Không hoạt động'}</span>
            </div>
            <div className="flex justify-end gap-3 pt-4">
                <Button onClick={handleReset} disabled={loading} type="default">Làm lại</Button>
                <Button onClick={onCancel} disabled={loading}>Hủy</Button>
                <Button type="primary" htmlType="submit" loading={loading}> {banner ? 'Cập nhật' : 'Tạo'} </Button>
            </div>
        </form>
    );
} 
