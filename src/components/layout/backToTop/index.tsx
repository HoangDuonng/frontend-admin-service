"use client";

import React, { useEffect, useState } from "react";
import Icon from "@/components/icon";

const BackToTop = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setVisible(window.scrollY > 200);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return visible ? (
        <button
            onClick={scrollToTop}
            className="fixed items-center justify-center bottom-6 right-6 z-50 w-10 h-10 rounded-full bg-blue-400 text-white shadow-lg hover:bg-blue-700 dark:bg-gray-700 dark:text-gray-100 transition"
            aria-label="Back to top"
        >
            <Icon category="arrows" name="up-arrow 01" className="w-5 h-5" style={{ stroke: "white", fill: "white", transform: "translateX(10px)" }} />
        </button>
    ) : null;
};

export default BackToTop;
