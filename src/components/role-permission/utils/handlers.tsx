import { Modal, message } from 'antd';
import { getRoleById } from '@/services/rolePermissionService';
import { Role } from '@/types/role-permission';
import React from 'react';

// Function xử lý sửa role
export const handleEditRole = async (
    role: Role,
    setEditRole: (role: Role) => void,
    setShowEditRoleModal: (show: boolean) => void
) => {
    // Chỉ disable cho system role, không phải admin
    if (role.isSystem && role.name !== 'admin' && role.displayName !== 'Admin') {
        return;
    }

    if (role.name === 'admin' || role.displayName === 'Admin') {
        Modal.confirm({
            title: 'Cảnh báo',
            content: 'Bạn đang sửa vai trò Admin. Hãy thật cẩn thận khi thay đổi quyền của vai trò này.',
            okText: 'Tiếp tục',
            cancelText: 'Hủy',
            onOk: async () => {
                try {
                    const roleDetail = await getRoleById(String(role.id));
                    setEditRole(roleDetail);
                    setShowEditRoleModal(true);
                } catch (e) {
                    console.error('Error loading role detail:', e);
                    message.error('Không thể tải thông tin vai trò');
                }
            },
            onCancel: () => {
                // User cancelled
            }
        });
    } else {
        try {
            const roleDetail = await getRoleById(String(role.id));
            setEditRole(roleDetail);
            setShowEditRoleModal(true);
        } catch (e) {
            console.error('Error loading role detail:', e);
            message.error('Không thể tải thông tin vai trò');
        }
    }
};

// Function xử lý xóa role
export const handleDeleteRole = (role: Role, deleteRole: (id: string) => Promise<any>, refreshData: () => void) => {
    Modal.confirm({
        icon: null,
        title: <span style={{ color: '#f87171', fontWeight: 700, fontSize: 22, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: '#fca5a5', fontSize: 28 }}>⚠️</span>
            Xác nhận xoá vai trò
        </span>,
        content: <div style={{ fontSize: 18, textAlign: 'center', margin: '16px 0' }}>Bạn có chắc chắn muốn xoá vai trò "<b>{role.displayName}</b>"?</div>,
        okText: 'Xoá',
        okType: 'danger',
        cancelText: 'Huỷ',
        width: 420,
        style: { top: 120 },
        okButtonProps: { style: { fontSize: 18, padding: '8px 32px', fontWeight: 600 } },
        cancelButtonProps: { style: { fontSize: 16, padding: '8px 32px' } },
        async onOk() {
            try {
                await deleteRole(String(role.id));
                message.success('Xoá vai trò thành công!');
                refreshData();
            } catch (e: any) {
                message.error(e.message || 'Xoá vai trò thất bại!');
            }
        },
    });
};

// Function xử lý xóa permission
export const handleDeletePermission = (perm: any, deletePermission: (id: string) => Promise<any>, refreshData: () => void) => {
    Modal.confirm({
        icon: null,
        title: <span style={{ color: '#f87171', fontWeight: 700, fontSize: 22, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: '#fca5a5', fontSize: 28 }}>⚠️</span>
            Xác nhận xoá quyền
        </span>,
        content: <div style={{ fontSize: 18, textAlign: 'center', margin: '16px 0' }}>Bạn có chắc chắn muốn xoá quyền "<b>{perm.displayName}</b>"?</div>,
        okText: 'Xoá',
        okType: 'danger',
        cancelText: 'Huỷ',
        width: 420,
        style: { top: 120 },
        okButtonProps: { style: { fontSize: 18, padding: '8px 32px', fontWeight: 600 } },
        cancelButtonProps: { style: { fontSize: 16, padding: '8px 32px' } },
        async onOk() {
            try {
                await deletePermission(String(perm.id));
                message.success('Xoá quyền thành công!');
                refreshData();
            } catch (e: any) {
                if (e.status === 409) {
                    const errorMessage = e.message || '';
                    const rolesMatch = errorMessage.match(/roles: (.+)$/);
                    if (rolesMatch) {
                        const roles = rolesMatch[1];
                        message.error(`Không thể xoá quyền: Quyền này đang được gán cho các vai trò: ${roles}`, 5);
                    } else {
                        message.error(`Không thể xoá quyền: ${errorMessage}`);
                    }
                } else {
                    message.error(e.message || 'Xoá quyền thất bại!');
                }
            }
        },
    });
}; 
