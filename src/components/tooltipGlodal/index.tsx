"use client";

import React from "react";
import { Tooltip } from "react-tooltip";

const TooltipGlodal = () => {
    return (
        <Tooltip
            id="global-tooltip"
            className="bg-[#272B30] text-[#F4F4F4] border border-[rgba(255,255,255,0.12)] px-3 py-2 text-sm rounded-lg shadow-lg"
            place="top"
            delayShow={200}
            delayHide={200}
        />
    );
};

export default TooltipGlodal; 
