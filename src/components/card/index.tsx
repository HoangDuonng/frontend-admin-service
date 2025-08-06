"use client";

import React from "react";

interface CardProps {
    title?: string;
    className?: string;
    classTitle?: string;
    head?: React.ReactNode;
    children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ title, className = "", classTitle = "", head, children }) => {
    return (
        <div
            className={`bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 transition-all duration-200 hover:shadow-xl border border-gray-100 dark:border-gray-700 ${className}`}
        >
            {(title || head) && (
                <div className="flex items-center justify-between mb-4">
                    {title && <h2 className={`text-lg font-semibold text-gray-800 dark:text-gray-100 ${classTitle}`}>{title}</h2>}
                    {head}
                </div>
            )}
            <div className="flex flex-col items-center justify-center min-h-[40px]">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">{typeof children === 'number' ? children : null}</div>
                {typeof children !== 'number' && children}
            </div>
        </div>
    );
};

export default Card; 
