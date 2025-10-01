"use client";

import React from "react";

interface RefundRequestsProps {
    title?: string;
    classTitle?: string;
}

const RefundRequests: React.FC<RefundRequestsProps> = ({ title = "Refund Requests", classTitle }) => {
    return (
        <div className="p-4 bg-white dark:bg-gray-700 rounded-lg shadow dark:border-gray-700 border">
            <h2 className={`text-lg font-semibold mb-4 ${classTitle}`}>{title}</h2>
            <div className="space-y-4">
                {/* Placeholder for refund requests */}
                <div className="p-3 border rounded-lg dark:border-gray-700 dark:bg-gray-600">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <p className="font-medium dark:text-gray-300">Order #12345</p>
                            <p className="text-sm text-gray-500 dark:text-gray-300">Product Name</p>
                        </div>
                        <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded">
                            Pending
                        </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                        Requested refund for damaged item...
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RefundRequests; 
