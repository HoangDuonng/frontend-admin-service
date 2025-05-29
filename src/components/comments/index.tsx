"use client";

import React from "react";

interface CommentsProps {
    className?: string;
}

const Comments: React.FC<CommentsProps> = ({ className }) => {
    return (
        <div className={`p-4 bg-white dark:bg-gray-700 rounded-lg shadow dark:border-gray-700 border ${className}`}>
            <h2 className="text-lg font-semibold mb-4">Recent Comments</h2>
            <div className="space-y-4">
                {/* Placeholder for comments */}
                <div className="p-3 border rounded-lg dark:border-gray-700 dark:bg-gray-600">
                    <div className="flex items-center space-x-3 mb-2">
                        <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                        <div>
                            <p className="font-medium dark:text-gray-300">User Name</p>
                            <p className="text-xs text-gray-500 dark:text-gray-300">2 hours ago</p>
                        </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                        This is a sample comment about the product...
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Comments; 
