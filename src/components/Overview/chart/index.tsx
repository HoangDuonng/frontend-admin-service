"use client";

import React from "react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

interface ChartProps {
    data?: { name: string; value: number }[];
}

const Chart: React.FC<ChartProps> = ({ data }) => {
    const chartData = data && data.length > 0 ? data : [
        { name: "Jan", value: 400 },
        { name: "Feb", value: 300 },
        { name: "Mar", value: 600 },
        { name: "Apr", value: 800 },
        { name: "May", value: 500 },
        { name: "Jun", value: 700 },
        { name: "Jul", value: 900 },
    ];
    return (
        <div className="h-64 w-full rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-700 shadow-md p-4">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={chartData}
                    margin={{
                        top: 20,
                        right: 30,
                        left: 0,
                        bottom: 0,
                    }}
                >
                    <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.5} />
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={13} />
                    <YAxis stroke="#64748b" fontSize={13} />
                    <Tooltip
                        contentStyle={{ borderRadius: 12, background: '#fff', border: '1px solid #e5e7eb', color: '#1e293b' }}
                        itemStyle={{ color: '#3b82f6' }}
                        labelStyle={{ color: '#64748b', fontWeight: 600 }}
                    />
                    <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#3b82f6"
                        fill="url(#colorValue)"
                        fillOpacity={1}
                        strokeWidth={3}
                        activeDot={{ r: 7, fill: '#2563eb', stroke: '#fff', strokeWidth: 2 }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default Chart; 
