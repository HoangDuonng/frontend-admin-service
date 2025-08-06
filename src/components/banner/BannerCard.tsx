"use client";

import React from 'react';
import { Banner, BannerPosition } from '@/types/banner';
import Icon from '@/components/icon';

const BANNER_POSITIONS: { value: BannerPosition; label: string; description: string }[] = [
    { value: 'header_banner_1', label: 'Header Banner 1', description: 'Banner đầu tiên trong header' },
    { value: 'header_banner_2', label: 'Header Banner 2', description: 'Banner thứ hai trong header' },
    { value: 'header_banner_3', label: 'Header Banner 3', description: 'Banner thứ ba trong header' },
    { value: 'header_banner_4', label: 'Header Banner 4', description: 'Banner thứ tư trong header' },
    { value: 'header_banner_5', label: 'Header Banner 5', description: 'Banner thứ năm trong header' },
    { value: 'home_video_banner', label: 'Home Video Banner', description: 'Video banner lớn ở trang chủ' },
];

interface BannerCardProps {
    banner: Banner;
    onEdit: (banner: Banner) => void;
    onDelete: (id: string) => void;
    onPreview?: (banner: Banner) => void;
}

export default function BannerCard({ banner, onEdit, onDelete, onPreview }: BannerCardProps) {
    const getPositionLabel = (position: BannerPosition) => {
        return BANNER_POSITIONS.find(p => p.value === position)?.label || position;
    };

    const getPositionDescription = (position: BannerPosition) => {
        return BANNER_POSITIONS.find(p => p.value === position)?.description || '';
    };

    // Thêm hàm kiểm tra url là video
    const isVideo = (url: string) => /\.(mp4|webm|mov)$/i.test(url);

    // Thêm hàm lấy url ảnh/video
    const getMediaUrl = (banner: Banner) => {
        if (banner.content) {
            return banner.content.url || '';
        }
        return '';
    };

    const mediaUrl = getMediaUrl(banner);
    const video = isVideo(mediaUrl);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow relative">
            {/* Image/Video Section */}
            <div className="relative">
                {banner.content && mediaUrl ? (
                    video ? (
                        <video
                            src={mediaUrl}
                            controls
                            className="w-full h-48 object-cover cursor-pointer transition-transform hover:scale-[1.02]"
                            onClick={() => onPreview && onPreview(banner)}
                        />
                    ) : (
                        <img
                            src={mediaUrl}
                            alt={banner.content.title || ''}
                            className="w-full h-48 object-cover cursor-pointer transition-transform hover:scale-[1.02]"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = '/images/default.webp';
                            }}
                            onClick={() => onPreview && onPreview(banner)}
                        />
                    )
                ) : (
                    <div className="w-full h-48 flex items-center justify-center bg-gray-100">
                        <Icon category="interface" name="image" className="w-16 h-16 text-gray-400" />
                    </div>
                )}

                {/* Badge góc trên trái */}
                {video ? (
                    <div className="absolute top-2 left-2">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 flex items-center">
                            <Icon category="interface" name="video" className="w-3 h-3 inline mr-1" />
                            Video
                        </span>
                    </div>
                ) : (
                    <div className="absolute top-2 left-2">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 flex items-center">
                            <Icon category="interface" name="image" className="w-3 h-3 inline mr-1" />
                            Ảnh
                        </span>
                    </div>
                )}

                {/* Status Badge */}
                <div className="absolute top-2 right-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${banner.isActive
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                        {banner.isActive ? 'Hoạt động' : 'Không hoạt động'}
                    </span>
                </div>
            </div>

            {/* Link Badge */}
            {banner.content && banner.content.buttonUrl && (
                <div className="absolute bottom-2 left-2">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                        <Icon category="interface" name="link" className="w-3 h-3 inline mr-1" />
                        Link
                    </span>
                </div>
            )}

            {/* Content Section */}
            <div className="p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-1">
                    {banner.content && banner.content.title ? banner.content.title : ''}
                </h3>

                <div className="space-y-2 mb-3">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        <Icon category="interface" name="location" className="w-3 h-3 inline mr-1" />
                        {getPositionLabel(banner.position as BannerPosition)}
                    </p>

                    {banner.content && banner.content.description && (
                        <p className="text-sm text-gray-500 dark:text-gray-500 line-clamp-2">
                            {banner.content.description || ''}
                        </p>
                    )}
                </div>

                {/* Metadata */}
                <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-500 mb-3">
                    <span>
                        <Icon category="interface" name="sort" className="w-3 h-3 inline mr-1" />
                        Thứ tự: {banner.order}
                    </span>
                    <span>
                        <Icon category="interface" name="calendar" className="w-3 h-3 inline mr-1" />
                        {new Date(banner.updatedAt || '').toLocaleDateString('vi-VN')}
                    </span>
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center">
                    <div className="text-xs text-gray-400 dark:text-gray-500">
                        {getPositionDescription(banner.position as BannerPosition)}
                    </div>

                    <div className="flex gap-1">
                        {onPreview && (
                            <button
                                onClick={() => onPreview(banner)}
                                className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                                title="Xem trước"
                            >
                                <Icon category="interface" name="eye" className="w-4 h-4" />
                            </button>
                        )}
                        <button
                            onClick={() => onEdit(banner)}
                            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                            title="Chỉnh sửa"
                        >
                            <Icon category="interface" name="edit" className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => onDelete(banner.id || '')}
                            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            title="Xóa"
                        >
                            <Icon category="interface" name="trash" className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div >
    );
} 
