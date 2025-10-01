"use client";

import React from "react";

interface PopularProductsProps {
    className?: string;
    views?: string;
}

const PopularProducts: React.FC<PopularProductsProps> = ({ className, views }) => {
    return (
        <div className={`p-4 bg-white dark:bg-gray-700 rounded-lg shadow dark:border-gray-700 border mt-3 dark:bg-gray-500 ${className}`}>
            <h2 className="text-lg font-semibold mb-4">Popular Products</h2>
            <div className="space-y-4">
                {/* Placeholder for popular products */}
                <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded dark:bg-gray-500">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-200 rounded"></div>
                        <div>
                            <p className="font-medium">Product Name</p>
                            <p className="text-sm text-gray-500">Category</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="font-medium">$99.99</p>
                        <p className="text-sm text-green-500">+12%</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PopularProducts; 
