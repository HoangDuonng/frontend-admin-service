"use client";

import React from "react";

interface ProTipsProps {
    className?: string;
}

const ProTips: React.FC<ProTipsProps> = ({ className }) => {
    return (
        <div className={`p-4 bg-white dark:bg-gray-700 rounded-lg shadow dark:border-gray-700 border ${className}`}>
            <h2 className="text-lg font-semibold mb-4">Pro Tips</h2>
            <div className="space-y-4">
                {/* Placeholder for pro tips */}
                <div className="p-3 bg-blue-50 dark:bg-gray-600 rounded-lg">
                    <h3 className="font-medium text-blue-800 mb-2 dark:text-gray-300">Tip Title</h3>
                    <p className="text-sm text-blue-600 dark:text-gray-300">
                        This is a helpful tip for managing your store...
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ProTips; 
