'use client';

import React, { useState } from 'react';
import Card from '@/components/card';
import Dropdown from '@/components/dropdown';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { useTheme } from 'next-themes';

const intervals = ['Last 30 days', 'Last 20 days', 'Last 10 days'];

const data = [
    {
        name: 'Sep 12',
        monthly: 500,
        weekly: 300,
        daily: 100,
    },
    {
        name: 'Sep 13',
        monthly: 600,
        weekly: 320,
        daily: 80,
    },
    {
        name: 'Sep 14',
        monthly: 550,
        weekly: 270,
        daily: 140,
    },
    {
        name: 'Sep 16',
        monthly: 450,
        weekly: 230,
        daily: 100,
    },
    {
        name: 'Sep 17',
        monthly: 620,
        weekly: 280,
        daily: 180,
    },
    {
        name: 'Sep 18',
        monthly: 500,
        weekly: 300,
        daily: 100,
    },
    {
        name: 'Sep 19',
        monthly: 600,
        weekly: 320,
        daily: 80,
    },
    {
        name: 'Sep 20',
        monthly: 550,
        weekly: 270,
        daily: 140,
    },
];

const ActiveCustomers = () => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [sorting, setSorting] = useState(intervals[0]);

    return (
        <Card
            title="Active customers"
            classTitle="title-purple"
            head={
                <Dropdown
                    value={sorting}
                    setValue={setSorting}
                    options={intervals}
                    small
                />
            }
        >
            <div className="w-auto h-[244px] -ml-[25px] -mb-2.5">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        width={500}
                        height={300}
                        data={data}
                        margin={{
                            top: 0,
                            right: 0,
                            left: 0,
                            bottom: 0,
                        }}
                    >
                        <CartesianGrid
                            strokeDasharray="none"
                            stroke={isDark ? '#272B30' : '#EFEFEF'}
                            vertical={false}
                        />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fontWeight: '500', fill: '#9A9FA5' }}
                            padding={{ left: 10 }}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fontWeight: '500', fill: '#9A9FA5' }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#272B30',
                                borderColor: 'rgba(255, 255, 255, 0.12)',
                                borderRadius: 8,
                                boxShadow:
                                    '0px 4px 8px rgba(0, 0, 0, 0.1), 0px 2px 4px rgba(0, 0, 0, 0.1), inset 0px 0px 1px #000000',
                            }}
                            labelStyle={{ fontSize: 12, fontWeight: '500', color: '#fff' }}
                            itemStyle={{
                                padding: 0,
                                textTransform: 'capitalize',
                                fontSize: 12,
                                fontWeight: '600',
                                color: '#fff',
                            }}
                        />
                        <Line
                            type="monotone"
                            dataKey="monthly"
                            dot={false}
                            strokeWidth={4}
                            stroke="#2A85FF"
                        />
                        <Line
                            type="monotone"
                            dataKey="weekly"
                            dot={false}
                            strokeWidth={4}
                            stroke="#B5E4CA"
                        />
                        <Line
                            type="monotone"
                            dataKey="daily"
                            dot={false}
                            strokeWidth={4}
                            stroke="#B1E5FC"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
};

export default ActiveCustomers; 
