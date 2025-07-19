'use client';

import React from 'react';
import { message } from 'antd';
import UserFormClient from '@/components/user/UserFormClient';

export default function UserCreateClient() {
    const handleAddUser = async (data: any) => {
        // TODO: Gọi API tạo user thực tế ở đây
        message.success('Tạo người dùng thành công!');
    };
    return <UserFormClient mode="add" onSubmit={handleAddUser} />;
} 
