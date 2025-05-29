"use client";

import React from "react";

interface CardProps {
    className?: string;
    title?: string;
    classTitle?: string;
    classCardHead?: string;
    head?: React.ReactNode;
    children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({
    className,
    title,
    classTitle,
    classCardHead,
    head,
    children,
}) => {
    return (
        <div className={`w-full bg-white dark:bg-gray-700 rounded-lg shadow dark:border-gray-700 border mt-3 ${className}`}>
            {title && (
                <div className={`flex items-center justify-between p-4 ${classCardHead}`}>
                    <div className={`text-lg font-semibold ${classTitle}`}>{title}</div>
                    {head && head}
                </div>
            )}
            <div className="p-4">{children}</div>
        </div>
    );
};

export default Card; 
