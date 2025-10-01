'use client';

import React from 'react';
import { Modal, Form, Input, Checkbox, Button, message } from 'antd';
import { createRole } from '@/services/rolePermissionService';
import { Role, Permission } from '@/types/role-permission';

interface CreateRoleModalProps {
    open: boolean;
    onCancel: () => void;
    onSuccess: () => void;
    allPermissions: Permission[];
    roleNameError: string;
    onRoleNameChange: (name: string) => void;
    creating: boolean;
}

export default function CreateRoleModal({
    open,
    onCancel,
    onSuccess,
    allPermissions,
    roleNameError,
    onRoleNameChange,
    creating
}: CreateRoleModalProps) {
    const [form] = Form.useForm();

    React.useEffect(() => {
        if (!open) {
            form.resetFields();
        }
    }, [open, form]);

    const handleSubmit = async (values: any) => {
        if (roleNameError) {
            message.error('Tên vai trò đã tồn tại, vui lòng chọn tên khác');
            return;
        }

        try {
            await createRole({
                name: values.name,
                displayName: values.displayName,
                description: values.description,
                isSystem: false,
                permissionIds: values.permissions || [],
            });
            message.success('Tạo vai trò thành công!');
            onSuccess();
        } catch (e: any) {
            message.error(e.message || 'Tạo vai trò thất bại!');
        }
    };

    return (
        <Modal
            open={open}
            onCancel={onCancel}
            footer={null}
            title={<span className="text-blue-700 font-bold text-xl">Tạo Vai trò mới</span>}
            width={700}
            styles={{ body: { padding: 40, fontSize: '1.15rem' } }}
            destroyOnHidden
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
            >
                <Form.Item
                    label="Tên vai trò (Name)"
                    name="name"
                    rules={[{ required: true, message: 'Nhập tên vai trò' }]}
                    className="text-base md:text-lg font-semibold"
                    validateStatus={roleNameError ? 'error' : ''}
                    help={roleNameError}
                >
                    <Input
                        size="large"
                        placeholder="Ví dụ: admin, client, user"
                        onChange={(e) => onRoleNameChange(e.target.value)}
                    />
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
                    <Button type="primary" htmlType="submit" loading={creating} size="large" className="bg-blue-600 hover:bg-blue-700 px-8 text-base md:text-lg">Tạo vai trò</Button>
                </div>
            </Form>
        </Modal>
    );
} 
