'use client';

import React from 'react';
import { Modal } from 'antd';
import { Role } from '@/types/role-permission';

interface ViewRoleModalProps {
    open: boolean;
    onCancel: () => void;
    viewRole: Role | null;
}

export default function ViewRoleModal({
    open,
    onCancel,
    viewRole
}: ViewRoleModalProps) {
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
            title={<span className="text-blue-700 font-bold text-xl">Chi tiết Vai trò</span>}
            width={750}
            styles={{ body: { padding: 40, fontSize: '1.25rem' } }}
            destroyOnHidden
        >
            {viewRole && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <div className="font-semibold">Tên vai trò (Name):</div>
                            <div className="mb-2">{viewRole.name || viewRole.displayName}</div>
                        </div>
                        <div>
                            <div className="font-semibold">Tên hiển thị (Display Name):</div>
                            <div className="mb-2">{viewRole.displayName}</div>
                        </div>
                        <div>
                            <div className="font-semibold">Mô tả:</div>
                            <div className="mb-2">{viewRole.description || '-'}</div>
                        </div>
                        <div>
                            <div className="font-semibold">Hệ thống:</div>
                            <div className="mb-2">{viewRole.isSystem ? 'Có' : 'Không'}</div>
                        </div>
                        <div>
                            <div className="font-semibold">Số quyền:</div>
                            <div className="mb-2">{viewRole.permissions?.length || 0}</div>
                        </div>
                        <div>
                            <div className="font-semibold">Ngày tạo:</div>
                            <div className="mb-2">{formatDate((viewRole as any).createdAt)}</div>
                        </div>
                        <div>
                            <div className="font-semibold">Cập nhật lần cuối:</div>
                            <div className="mb-2">{formatDate((viewRole as any).updatedAt)}</div>
                        </div>
                    </div>
                    <div>
                        <b>Danh sách quyền:</b>
                        {Array.isArray(viewRole.permissions) && viewRole.permissions.length > 0 ? (
                            <table className="w-full text-xs border mt-2">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="p-2 border">Name</th>
                                        <th className="p-2 border">Display Name</th>
                                        <th className="p-2 border">Mô tả</th>
                                        <th className="p-2 border">Hành động</th>
                                        <th className="p-2 border">Module</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {viewRole.permissions.map((perm, idx) => (
                                        <tr key={perm.id || idx}>
                                            <td className="p-2 border">{perm.name || perm.displayName}</td>
                                            <td className="p-2 border">{perm.displayName}</td>
                                            <td className="p-2 border">{perm.description}</td>
                                            <td className="p-2 border">{perm.action}</td>
                                            <td className="p-2 border">{perm.module}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="text-gray-500 text-sm">Không có quyền</div>
                        )}
                    </div>
                </div>
            )}
        </Modal>
    );
} 
