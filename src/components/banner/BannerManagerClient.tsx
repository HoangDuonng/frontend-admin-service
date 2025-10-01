"use client";

import React, { useState, useEffect } from 'react';
import { Banner, CreateBannerRequest } from '@/types/banner';
import { getBanners, createBanner, updateBanner, deleteBanner, getAllRawBanners } from '@/services/bannerService';
import Icon from '@/components/icon';
import { message } from 'antd';
import BannerCard from './BannerCard';
import BannerForm from './BannerForm';
// import BannerPreview from './BannerPreview';
import { FaPlus } from 'react-icons/fa';

export default function BannerManagerClient() {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
    const [formLoading, setFormLoading] = useState(false);
    const [previewBanner, setPreviewBanner] = useState<Banner | null>(null);

    useEffect(() => {
        fetchBanners();
    }, []);

    const fetchBanners = async () => {
        setLoading(true);
        try {
            const data = await getAllRawBanners();
            setBanners(data);
        } catch (error) {
            message.error('Không thể tải danh sách banner');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (bannerData: CreateBannerRequest) => {
        setFormLoading(true);
        try {
            if (editingBanner) {
                const id = editingBanner.id || (editingBanner as any)._id || '';
                const updated = await updateBanner({ ...bannerData, id });
                if (updated) {
                    message.success('Cập nhật banner thành công');
                    setShowModal(false);
                    fetchBanners();
                } else {
                    message.error('Không thể cập nhật banner');
                }
            } else {
                const created = await createBanner(bannerData);
                if (created) {
                    message.success('Tạo banner thành công');
                    setShowModal(false);
                    fetchBanners();
                } else {
                    message.error('Không thể tạo banner');
                }
            }
        } catch (error) {
            message.error('Có lỗi xảy ra');
        } finally {
            setFormLoading(false);
        }
    };

    const handleEdit = (banner: Banner) => {
        console.log('[BannerManagerClient] handleEdit', banner);
        setEditingBanner(banner);
        setShowModal(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa banner này?')) {
            try {
                const success = await deleteBanner(id);
                if (success) {
                    message.success('Xóa banner thành công');
                    fetchBanners();
                } else {
                    message.error('Không thể xóa banner');
                }
            } catch (error) {
                message.error('Có lỗi xảy ra');
            }
        }
    };

    const handlePreview = (banner: Banner) => {
        setEditingBanner(banner);
        setShowModal(true);
    };

    const openCreateModal = () => {
        setEditingBanner(null);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingBanner(null);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="loader"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-end items-center">
                <button
                    onClick={openCreateModal}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                    <FaPlus className="w-4 h-4" />
                    Thêm Banner
                </button>
            </div>

            {/* Banner List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {banners.map((banner, index) => (
                    <BannerCard
                        key={banner.id || (banner as any)._id || index}
                        banner={banner}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onPreview={handlePreview}
                    />
                ))}
            </div>

            {/* Empty State */}
            {banners.length === 0 && (
                <div className="text-center py-12">
                    <Icon category="interface" name="image" className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        Chưa có banner nào
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                        Bắt đầu bằng cách tạo banner đầu tiên
                    </p>
                    <button
                        onClick={openCreateModal}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Tạo Banner
                    </button>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                {editingBanner ? 'Chỉnh sửa Banner' : 'Thêm Banner Mới'}
                            </h2>
                            <button
                                onClick={closeModal}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                                <Icon category="interface" name="close" className="w-6 h-6" />
                            </button>
                        </div>

                        <BannerForm
                            banner={editingBanner || undefined}
                            onSubmit={handleSubmit}
                            onCancel={closeModal}
                            loading={formLoading}
                        />
                    </div>
                </div>
            )}

            {/* Preview Modal */}
            {/* {previewBanner && (
                <BannerPreview
                    banner={previewBanner}
                    onClose={() => setPreviewBanner(null)}
                />
            )} */}
        </div>
    );
} 
