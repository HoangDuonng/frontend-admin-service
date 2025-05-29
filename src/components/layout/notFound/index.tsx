"use client";

import React from "react";

const NotFound = () => {
    return (
        <div className="flex flex-1 flex-col items-center justify-center w-full bg-gradient-to-br from-blue-100 to-green-100 rounded-lg p-8 mt-8">
            <img
                src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80"
                alt="Travel 360"
                className="w-64 h-64 object-cover rounded-full shadow-lg mb-8 dark:border-gray-700 border-2"
            />
            <h1 className="text-4xl font-bold text-blue-700 mb-4 dark:text-gray-700">404 - Không tìm thấy trang</h1>
            <p className="text-lg text-gray-700 mb-6 text-center">
                Có vẻ như bạn đang lạc giữa hành trình quản lý tour du lịch 360°.<br />
                Hãy quay về trang chủ để tiếp tục khám phá thế giới!
            </p>
            <a
                href="/"
                className="px-6 py-2 bg-blue-600 text-white rounded-full shadow hover:bg-blue-700 transition dark:bg-gray-700"
            >
                Quay về trang chủ
            </a>
        </div>
    );
};

export default NotFound;
