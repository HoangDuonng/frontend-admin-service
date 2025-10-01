"use client";

import React from "react";

interface PaginationProps {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ page, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
    }

    return (
        <div className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-full shadow-lg px-4 py-2 border border-gray-200 dark:border-gray-700">
            <button
                className="px-3 py-1 rounded-full text-sm font-semibold text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                onClick={() => onPageChange(page - 1)}
                disabled={page === 1}
            >
                Prev
            </button>
            {pages.map((p) => (
                <button
                    key={p}
                    className={`px-3 py-1 rounded-full text-sm font-semibold transition ${p === page ? 'bg-blue-600 text-white shadow' : 'text-gray-700 hover:bg-blue-100'}`}
                    onClick={() => onPageChange(p)}
                >
                    {p}
                </button>
            ))}
            <button
                className="px-3 py-1 rounded-full text-sm font-semibold text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                onClick={() => onPageChange(page + 1)}
                disabled={page === totalPages}
            >
                Next
            </button>
        </div>
    );
};

export default Pagination; 
