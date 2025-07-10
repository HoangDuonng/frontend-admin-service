"use client";

import React from "react";

export default function Homepage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center w-full bg-gradient-to-br from-yellow-100 to-pink-100 rounded-lg p-8 mt-8">
      <img
        src="https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80"
        alt="Coming Soon"
        className="w-64 h-64 object-cover rounded-full shadow-lg mb-8 dark:border-gray-700 border-2"
      />
      <h1 className="text-4xl font-bold text-pink-700 mb-4 dark:text-gray-700">Coming Soon</h1>
      <p className="text-lg text-gray-700 mb-6 text-center">
        Trang này đang được phát triển.<br />Hãy quay lại sau để khám phá những tính năng mới!
      </p>
      <a
        href="/"
        className="px-6 py-2 bg-pink-600 text-white rounded-full shadow hover:bg-pink-700 transition dark:bg-gray-700"
      >
        Quay về trang chủ
      </a>
    </div>
  );
}