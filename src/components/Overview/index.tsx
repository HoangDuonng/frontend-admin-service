"use client";

import React, { useState } from "react";
import Card from "../card";
import Dropdown from "../dropdown";
import Users from "../user";
import Chart from "./chart";

const intervals = ["All time", "In a year", "Per month"];

const nav = [
    {
        title: "Customers",
        counter: "1024",
        // icon: "shopping-bag",
        color: "#B1E5FC",
        value: -37.8,
    },
    {
        title: "Income",
        counter: "256k",
        // icon: "activity",
        color: "#CABDFF",
        value: 37.8,
    },
];

interface OverviewProps {
    className?: string;
}

const Overview: React.FC<OverviewProps> = ({ className }) => {
    const [sorting, setSorting] = useState(intervals[0]);
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <Card
            className={className}
            title="Overview"
            classTitle="text-black-500 dark:text-gray-300"
            head={
                <Dropdown
                    className="w-40"
                    value={sorting}
                    setValue={setSorting}
                    options={intervals}
                    small
                />
            }
        >
            <div className="space-y-4">
                <div className="flex space-x-4 dark:bg-gray-700 rounded-lg">
                    {nav.map((x, index) => (
                        <div
                            key={index}
                            className={`flex-1 p-4 rounded-lg cursor-pointer transition-colors dark:bg-gray-600 dark:hover:bg-gray-500 ${index === activeIndex ? "bg-blue-50" : "hover:bg-gray-50"
                                }`}
                            onClick={() => setActiveIndex(index)}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center space-x-2">
                                    <div
                                        className="w-8 h-8 rounded-full flex items-center justify-center"
                                        style={{ backgroundColor: x.color }}
                                    >
                                        {/* <span className="text-white">{x.icon}</span> */}
                                    </div>
                                    <span className="font-medium">{x.title}</span>
                                </div>
                                <span className="text-sm text-gray-500">{x.counter}</span>
                            </div>
                            <div className="flex items-center">
                                <span
                                    className={`text-sm ${x.value > 0 ? "text-green-500" : "text-red-500"
                                        }`}
                                >
                                    {x.value > 0 ? "+" : ""}
                                    {x.value}%
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-4">
                    {/* {activeIndex === 0 && <Users />} */}
                    {activeIndex === 1 && <Chart />}
                </div>
            </div>
        </Card>
    );
};

export default Overview; 
