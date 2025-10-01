'use client';

import React from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import { updatePermission } from '@/services/rolePermissionService';
import { Permission } from '@/types/role-permission';

interface EditPermissionModalProps {
    open: boolean;
    onCancel: () => void;
    onSuccess: () => void;
    editPermission: Permission | null;
    saving: boolean;
}

export default function EditPermissionModal({
    open,
    onCancel,
    onSuccess,
    editPermission,
    saving
}: EditPermissionModalProps) {
    const [form] = Form.useForm();

    React.useEffect(() => {
        if (editPermission && open) {
            form.setFieldsValue({
                name: editPermission.name || editPermission.displayName,
                displayName: editPermission.displayName,
                description: editPermission.description,
                action: editPermission.action,
                module: editPermission.module,
            });
        }
    }, [editPermission, open, form]);

    React.useEffect(() => {
        if (!open) {
            form.resetFields();
        }
    }, [open, form]);

    const handleSubmit = async (values: any) => {
        try {
            await updatePermission(String(editPermission?.id), {
                name: values.name,
                displayName: values.displayName,
                description: values.description,
                action: values.action,
                module: values.module,
            });
            message.success('Cập nhật quyền thành công!');
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
            title={<span className="text-blue-700 font-bold text-xl">Sửa Quyền</span>}
            width={600}
            styles={{ body: { padding: 40, fontSize: '1.15rem' } }}
            destroyOnHidden
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
            >
                <Form.Item label="Tên quyền (Name)" name="name" rules={[{ required: true, message: 'Nhập tên quyền' }]} className="text-base md:text-lg font-semibold">
                    <Input size="large" placeholder="Ví dụ: create_user, read_user, delete_user" />
                </Form.Item>
                <Form.Item label="Tên hiển thị (Display Name)" name="displayName" rules={[{ required: true, message: 'Nhập tên hiển thị' }]} className="text-base md:text-lg font-semibold">
                    <Input size="large" placeholder="Ví dụ: Create User, Read User, Delete User" />
                </Form.Item>
                <Form.Item label="Mô tả" name="description" className="text-base md:text-lg font-semibold">
                    <Input.TextArea rows={3} size="large" />
                </Form.Item>
                <Form.Item
                    label="Hành động"
                    name="action"
                    rules={[{ required: true, message: 'Nhập action' }]}
                    className="text-base md:text-lg font-semibold"
                >
                    <Input
                        size="large"
                        placeholder="Ví dụ: create, read, update, delete"
                    />
                </Form.Item>
                <Form.Item label="Module" name="module" rules={[{ required: true, message: 'Nhập module' }]} className="text-base md:text-lg font-semibold">
                    <Input size="large" />
                </Form.Item>
                <div className="flex justify-end mt-8">
                    <Button type="primary" htmlType="submit" loading={saving} size="large" className="bg-blue-600 hover:bg-blue-700 px-8 text-base md:text-lg">Cập nhật quyền</Button>
                </div>
            </Form>
        </Modal>
    );
} 
