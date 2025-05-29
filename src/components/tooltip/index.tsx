"use client";

import React from "react";
import Icon from "../icon";

interface TooltipProps {
    className?: string;
    title: string;
    icon: string;
    place?: "top" | "right" | "bottom" | "left";
}

const Tooltip: React.FC<TooltipProps> = ({ className, title, icon, place = "top" }) => {
    return (
        <div className={`inline-block ${className}`}>
            <span data-tip={title} data-place={place}>
                <Icon category="interface" name={icon} />
            </span>
        </div>
    );
};

export default Tooltip; 
