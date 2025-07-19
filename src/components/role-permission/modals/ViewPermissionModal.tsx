'use client';

import React from 'react';
import { Modal } from 'antd';
import { Permission } from '@/types/role-permission';

interface ViewPermissionModalProps {
    open: boolean;
    onCancel: () => void;
    viewPermission: Permission | null;
}

export default function ViewPermissionModal({
    open,
    onCancel,
    viewPermission
}: ViewPermissionModalProps) {
    function formatDate(dateStr?: string) {
        if (!dateStr) return '-';
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return '-';
        return d.toLocaleString('vi-VN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
    }

    return (
        <Modal
            open={open}
            onCancel={onCancel}
            footer={null}
            title={<span className="text-blue-700 font-bold text-xl">Chi tiết Quyền</span>}
            width={600}
            styles={{ body: { padding: 40, fontSize: '1.25rem' } }}
            destroyOnHidden
        >
            {viewPermission && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <div className="font-semibold">Tên quyền (Name):</div>
                            <div className="mb-2">{viewPermission.name || viewPermission.displayName}</div>
                        </div>
                        <div>
                            <div className="font-semibold">Tên hiển thị (Display Name):</div>
                            <div className="mb-2">{viewPermission.displayName}</div>
                        </div>
                        <div>
                            <div className="font-semibold">Mô tả:</div>
                            <div className="mb-2">{viewPermission.description || '-'}</div>
                        </div>
                        <div>
                            <div className="font-semibold">Hành động:</div>
                            <div className="mb-2">{viewPermission.action}</div>
                        </div>
                        <div>
                            <div className="font-semibold">Module:</div>
                            <div className="mb-2">{viewPermission.module}</div>
                        </div>
                        <div>
                            <div className="font-semibold">Ngày tạo:</div>
                            <div className="mb-2">{formatDate((viewPermission as any).createdAt)}</div>
                        </div>
                        <div>
                            <div className="font-semibold">Cập nhật lần cuối:</div>
                            <div className="mb-2">{formatDate((viewPermission as any).updatedAt)}</div>
                        </div>
                    </div>
                </div>
            )}
        </Modal>
    );
} 
