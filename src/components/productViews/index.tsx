"use client";

import React from "react";

interface ProductViewsProps {
    className?: string;
}

const ProductViews: React.FC<ProductViewsProps> = ({ className }) => {
    return (
        <div className={`p-4 bg-white dark:bg-gray-700 rounded-lg shadow dark:border-gray-700 border ${className}`}>
            <h2 className="text-lg font-semibold mb-4">Product Views</h2>
            <div className="space-y-4">
                {/* Placeholder for product views */}
                <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded dark:hover:bg-gray-500 dark:bg-gray-600">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-200 rounded"></div>
                        <div>
                            <p className="font-medium">Product Name</p>
                            <p className="text-sm text-gray-500">Category</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="font-medium">1.2K Views</p>
                        <p className="text-sm text-green-500">+8%</p>
                    </div>
                </div>
                <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded dark:hover:bg-gray-500 dark:bg-gray-600">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-200 rounded"></div>
                        <div>
                            <p className="font-medium">Another Product</p>
                            <p className="text-sm text-gray-500">Category</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="font-medium">856 Views</p>
                        <p className="text-sm text-red-500">-2%</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductViews; 
