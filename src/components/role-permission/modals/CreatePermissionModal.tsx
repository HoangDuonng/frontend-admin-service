'use client';

import React from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import { createPermission } from '@/services/rolePermissionService';

interface CreatePermissionModalProps {
    open: boolean;
    onCancel: () => void;
    onSuccess: () => void;
    permNameError: string;
    actionError: string;
    onPermNameChange: (name: string) => void;
    onActionChange: (action: string) => void;
    creating: boolean;
}

export default function CreatePermissionModal({
    open,
    onCancel,
    onSuccess,
    permNameError,
    actionError,
    onPermNameChange,
    onActionChange,
    creating
}: CreatePermissionModalProps) {
    const [form] = Form.useForm();

    React.useEffect(() => {
        if (!open) {
            form.resetFields();
        }
    }, [open, form]);

    const handleSubmit = async (values: any) => {
        if (permNameError) {
            message.error('Tên quyền đã tồn tại, vui lòng chọn tên khác');
            return;
        }
        if (actionError) {
            message.error('Action không đúng format, vui lòng kiểm tra lại');
            return;
        }

        try {
            await createPermission({
                name: values.name,
                displayName: values.displayName,
                description: values.description,
                action: values.action,
                module: values.module,
            });
            message.success('Tạo quyền thành công!');
            onSuccess();
        } catch (e: any) {
            message.error(e.message || 'Tạo quyền thất bại!');
        }
    };

    return (
        <Modal
            open={open}
            onCancel={onCancel}
            footer={null}
            title={<span className="text-blue-700 font-bold text-xl">Tạo Quyền mới</span>}
            width={600}
            styles={{ body: { padding: 40, fontSize: '1.15rem' } }}
            destroyOnHidden
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
            >
                <Form.Item
                    label="Tên quyền (Name)"
                    name="name"
                    rules={[{ required: true, message: 'Nhập tên quyền' }]}
                    className="text-base md:text-lg font-semibold"
                    validateStatus={permNameError ? 'error' : ''}
                    help={permNameError}
                >
                    <Input
                        size="large"
                        placeholder="Ví dụ: create_user, read_user, delete_user"
                        onChange={(e) => onPermNameChange(e.target.value)}
                    />
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
                    validateStatus={actionError ? 'error' : ''}
                    help={actionError}
                >
                    <Input
                        size="large"
                        placeholder="Ví dụ: create, read, update, delete"
                        onChange={(e) => onActionChange(e.target.value)}
                    />
                </Form.Item>
                <Form.Item label="Module" name="module" rules={[{ required: true, message: 'Nhập module' }]} className="text-base md:text-lg font-semibold">
                    <Input size="large" />
                </Form.Item>
                <div className="flex justify-end mt-8">
                    <Button type="primary" htmlType="submit" loading={creating} size="large" className="bg-blue-600 hover:bg-blue-700 px-8 text-base md:text-lg">Tạo quyền</Button>
                </div>
            </Form>
        </Modal>
    );
} 
