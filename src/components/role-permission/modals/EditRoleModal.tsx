'use client';

import React from 'react';
import { Modal, Form, Input, Checkbox, Button, message } from 'antd';
import { updateRole } from '@/services/rolePermissionService';
import { Role, Permission } from '@/types/role-permission';

interface EditRoleModalProps {
    open: boolean;
    onCancel: () => void;
    onSuccess: () => void;
    editRole: Role | null;
    allPermissions: Permission[];
    saving: boolean;
}

export default function EditRoleModal({
    open,
    onCancel,
    onSuccess,
    editRole,
    allPermissions,
    saving
}: EditRoleModalProps) {
    const [form] = Form.useForm();

    React.useEffect(() => {
        if (editRole && open) {
            form.setFieldsValue({
                name: editRole.name || editRole.displayName,
                displayName: editRole.displayName,
                description: editRole.description,
                permissions: editRole.permissions?.map(p => p.id),
            });
        }
    }, [editRole, open, form]);

    React.useEffect(() => {
        if (!open) {
            form.resetFields();
        }
    }, [open, form]);

    const handleSubmit = async (values: any) => {
        try {
            await updateRole(String(editRole?.id), {
                name: values.name,
                displayName: values.displayName,
                description: values.description,
                permissionIds: values.permissions,
            });
            message.success('Cập nhật vai trò thành công!');
            onSuccess();
        } catch (e: any) {
            message.error(e.message || 'Cập nhật thất bại!');
        }
    };

    return (
        <Modal
            open={open}
            onCancel={onCancel}
            footer={null}
            title={<span className="text-blue-700 font-bold text-xl">Sửa Vai trò</span>}
            width={700}
            styles={{ body: { padding: 40, fontSize: '1.15rem' } }}
            destroyOnHidden
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
            >
                <Form.Item label="Tên vai trò (Name)" name="name" rules={[{ required: true, message: 'Nhập tên vai trò' }]} className="text-base md:text-lg font-semibold">
                    <Input size="large" placeholder="Ví dụ: admin, client, user" />
                </Form.Item>
                <Form.Item label="Tên hiển thị (Display Name)" name="displayName" rules={[{ required: true, message: 'Nhập tên hiển thị' }]} className="text-base md:text-lg font-semibold">
                    <Input size="large" placeholder="Ví dụ: Administrator, Client, User" />
                </Form.Item>
                <Form.Item label="Mô tả" name="description" className="text-base md:text-lg font-semibold">
                    <Input.TextArea rows={3} size="large" />
                </Form.Item>
                <Form.Item label="Quyền" name="permissions" className="text-base md:text-lg font-semibold">
                    {allPermissions.length > 0 ? (
                        <Checkbox.Group className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {allPermissions.map(p => (
                                <Checkbox key={p.id} value={p.id} className="text-blue-700 text-base md:text-lg">
                                    <div>
                                        <div className="font-medium">{p.displayName}</div>
                                        <div className="text-xs text-gray-500">{p.name}</div>
                                    </div>
                                </Checkbox>
                            ))}
                        </Checkbox.Group>
                    ) : (
                        <div className="text-gray-500 text-center py-4">Đang tải danh sách quyền...</div>
                    )}
                </Form.Item>
                <div className="flex justify-end mt-8">
                    <Button type="primary" htmlType="submit" loading={saving} size="large" className="bg-blue-600 hover:bg-blue-700 px-8 text-base md:text-lg">Cập nhật vai trò</Button>
                </div>
            </Form>
        </Modal>
    );
} 
