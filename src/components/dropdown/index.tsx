"use client";

import React, { useState, useRef } from "react";
import {
    useFloating,
    useInteractions,
    useClick,
    useDismiss,
    offset,
    flip,
    shift,
} from "@floating-ui/react";
import Tooltip from "../tooltip";

interface DropdownProps {
    className?: string;
    classDropdownHead?: string;
    classDropdownLabel?: string;
    value: string;
    setValue: (value: string) => void;
    options: string[];
    label?: string;
    tooltip?: string;
    small?: boolean;
    upBody?: boolean;
}

const Dropdown: React.FC<DropdownProps> = ({
    className,
    classDropdownHead,
    classDropdownLabel,
    value,
    setValue,
    options,
    label,
    tooltip,
    small,
    upBody,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const buttonRef = useRef<HTMLDivElement>(null);

    const { refs, floatingStyles, context } = useFloating({
        open: isOpen,
        onOpenChange: setIsOpen,
        placement: upBody ? "top" : "bottom",
        middleware: [offset(5), flip(), shift()],
    });

    const click = useClick(context);
    const dismiss = useDismiss(context);
    const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss]);

    const handleClick = (value: string) => {
        setValue(value);
        setIsOpen(false);
    };

    return (
        <div>
            {label && (
                <div className={`text-sm text-gray-500 mb-2 ${classDropdownLabel}`}>
                    {label}{" "}
                    {tooltip && (
                        <Tooltip
                            className="ml-1"
                            title={tooltip}
                            icon="info"
                            place="right"
                        />
                    )}
                </div>
            )}
            <div
                className={`relative ${small ? "text-sm" : "text-base"
                    } ${className} ${isOpen ? "border-blue-500" : "border-gray-200"
                    } border rounded-lg`}
            >
                <div
                    ref={refs.setReference}
                    {...getReferenceProps()}
                    className={`flex items-center justify-between p-2 cursor-pointer ${classDropdownHead}`}
                >
                    <div className="text-gray-900">{value}</div>
                    <i className="icon-arrow-down ml-2" />
                </div>
                {isOpen && (
                    <div
                        ref={refs.setFloating}
                        style={floatingStyles}
                        {...getFloatingProps()}
                        className="bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[200px]"
                    >
                        {options.map((x, index) => (
                            <div
                                key={index}
                                className={`p-2 cursor-pointer hover:bg-gray-50 ${x === value ? "bg-blue-50 text-blue-500" : "text-gray-900"
                                    }`}
                                onClick={() => handleClick(x)}
                            >
                                {x}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dropdown; 
